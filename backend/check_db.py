import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from careers.models import Career
from universities.models import Country, University
from scholarships.models import Scholarship
from orientation.models import OrientationQuestion

print(f"Careers: {Career.objects.count()}")
print(f"Countries: {Country.objects.count()}")
print(f"Universities: {University.objects.count()}")
print(f"Scholarships: {Scholarship.objects.count()}")
print(f"Orientation Questions: {OrientationQuestion.objects.count()}")
