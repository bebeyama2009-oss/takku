from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import OrientationQuestion, OrientationTest
from .serializers import OrientationQuestionSerializer, OrientationTestSerializer
from careers.models import Career
from careers.serializers import CareerSerializer

class OrientationQuestionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = OrientationQuestion.objects.all().order_by('order')
    serializer_class = OrientationQuestionSerializer

class OrientationTestViewSet(viewsets.ModelViewSet):
    queryset = OrientationTest.objects.all()
    serializer_class = OrientationTestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return OrientationTest.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'])
    def submit(self, request, pk=None):
        test = self.get_object()
        answers = request.data.get('answers', {})
        test.answers = answers
        
        # Simple algorithm for recommendation
        scores = {} # category -> score
        for question_id, answer in answers.items():
            try:
                question = OrientationQuestion.objects.get(id=question_id)
                mapping = question.category_mapping
                if isinstance(answer, (int, float)) and question.question_type == 'SCALE':
                    for cat, weight in mapping.items():
                        scores[cat] = scores.get(cat, 0) + (answer * weight)
                elif isinstance(answer, str):
                    cat_scores = mapping.get(answer, {})
                    for cat, score in cat_scores.items():
                        scores[cat] = scores.get(cat, 0) + score
            except OrientationQuestion.DoesNotExist:
                continue
        
        # Sort careers by compatibility
        recommended = []
        careers = Career.objects.all()
        for career in careers:
            # Map career category to our scoring categories
            # For simplicity, assume they match or have a mapping
            career_score = scores.get(career.category, 0)
            recommended.append({
                'id': career.id,
                'name': career.name,
                'slug': career.slug,
                'score': int(min(career_score * 10, 100)) # Simple normalization
            })
            
        recommended.sort(key=lambda x: x['score'], reverse=True)
        test.recommended_careers = recommended[:5]
        test.compatibility_scores = scores
        test.completed = True
        test.save()
        
        return Response(test.recommended_careers)
