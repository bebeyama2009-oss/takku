import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from careers.models import Career, CareerPath
from universities.models import Country, University, Program
from scholarships.models import Scholarship
from orientation.models import OrientationQuestion, OrientationTest

print("Deleting existing data...")
CareerPath.objects.all().delete()
Career.objects.all().delete()
Program.objects.all().delete()
University.objects.all().delete()
Country.objects.all().delete()
Scholarship.objects.all().delete()
OrientationQuestion.objects.all().delete()
OrientationTest.objects.all().delete()
print("Done.")
