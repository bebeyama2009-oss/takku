import random
from datetime import date, timedelta
from django.core.management.base import BaseCommand
from django.utils.text import slugify
from users.models import User
from careers.models import Career, CareerPath
from universities.models import Country, University, Program
from scholarships.models import Scholarship
from orientation.models import OrientationQuestion
from opportunities.models import Opportunity


class Command(BaseCommand):
    help = 'Seeds the database with complete Takku Avenir data'

    def handle(self, *args, **kwargs):
        self.stdout.write('🌱 Seeding Takku Avenir data...')
        admin = self._create_admin()
        countries = self._seed_countries()
        careers = self._seed_careers()
        self._seed_universities(countries)
        self._seed_scholarships(countries, careers)
        self._seed_questions()
        self._seed_opportunities(admin)
        self.stdout.write(self.style.SUCCESS('✅ Seeding complete!'))

    def _create_admin(self):
        user, _ = User.objects.get_or_create(
            username='admin',
            defaults={'email': 'admin@takkuavenir.sn', 'is_staff': True, 'is_superuser': True, 'first_name': 'Admin', 'last_name': 'Takku'}
        )
        user.set_password('admin123')
        user.save()
        self.stdout.write('  ✓ Admin user ready (admin / admin123)')
        return user

    def _seed_countries(self):
        data = [
            {'name': 'Sénégal', 'flag': '🇸🇳', 'lang': 'Français', 'curr': 'FCFA', 'tuition': 75000, 'living': 150000, 'visa': False},
            {'name': 'France', 'flag': '🇫🇷', 'lang': 'Français', 'curr': 'EUR', 'tuition': 170000, 'living': 900000, 'visa': True},
            {'name': 'Canada', 'flag': '🇨🇦', 'lang': 'Français/Anglais', 'curr': 'CAD', 'tuition': 1200000, 'living': 1100000, 'visa': True},
            {'name': 'Maroc', 'flag': '🇲🇦', 'lang': 'Arabe/Français', 'curr': 'MAD', 'tuition': 200000, 'living': 300000, 'visa': True},
            {'name': 'Tunisie', 'flag': '🇹🇳', 'lang': 'Arabe/Français', 'curr': 'TND', 'tuition': 150000, 'living': 280000, 'visa': True},
            {'name': 'Belgique', 'flag': '🇧🇪', 'lang': 'Français', 'curr': 'EUR', 'tuition': 180000, 'living': 850000, 'visa': True},
            {'name': 'Allemagne', 'flag': '🇩🇪', 'lang': 'Allemand', 'curr': 'EUR', 'tuition': 50000, 'living': 800000, 'visa': True},
            {'name': 'États-Unis', 'flag': '🇺🇸', 'lang': 'Anglais', 'curr': 'USD', 'tuition': 3000000, 'living': 1500000, 'visa': True},
            {'name': 'Espagne', 'flag': '🇪🇸', 'lang': 'Espagnol', 'curr': 'EUR', 'tuition': 160000, 'living': 700000, 'visa': True},
            {'name': 'Côte d\'Ivoire', 'flag': '🇨🇮', 'lang': 'Français', 'curr': 'FCFA', 'tuition': 100000, 'living': 200000, 'visa': False},
            {'name': 'Gabon', 'flag': '🇬🇦', 'lang': 'Français', 'curr': 'FCFA', 'tuition': 120000, 'living': 250000, 'visa': True},
            {'name': 'Cameroun', 'flag': '🇨🇲', 'lang': 'Français/Anglais', 'curr': 'FCFA', 'tuition': 80000, 'living': 180000, 'visa': True},
            {'name': 'Ghana', 'flag': '🇬🇭', 'lang': 'Anglais', 'curr': 'GHS', 'tuition': 500000, 'living': 350000, 'visa': True},
            {'name': 'Mauritanie', 'flag': '🇲🇷', 'lang': 'Arabe/Français', 'curr': 'MRO', 'tuition': 90000, 'living': 200000, 'visa': True},
            {'name': 'Portugal', 'flag': '🇵🇹', 'lang': 'Portugais', 'curr': 'EUR', 'tuition': 140000, 'living': 700000, 'visa': True},
        ]
        countries = {}
        for c in data:
            obj, _ = Country.objects.get_or_create(
                name=c['name'],
                defaults={
                    'flag_emoji': c['flag'], 'language': c['lang'],
                    'currency': c['curr'], 'average_tuition_public': c['tuition'],
                    'living_cost_monthly': c['living'], 'visa_required': c['visa'],
                }
            )
            countries[c['name']] = obj
        self.stdout.write(f'  ✓ {len(countries)} pays créés')
        return countries

    def _seed_careers(self):
        data = [
            # SANTE
            ('Médecin Généraliste', 'SANTE', 'Diagnostiquer et traiter les maladies courantes. Premier recours pour les patients.', 'Bac+7', 700000, 1500000, ['Rigueur', 'Empathie', 'Diagnostic', 'Communication']),
            ('Chirurgien', 'SANTE', 'Réaliser des interventions chirurgicales complexes en milieu hospitalier.', 'Bac+11', 1200000, 3000000, ['Précision', 'Sang-froid', 'Endurance', 'Leadership']),
            ('Pharmacien', 'SANTE', 'Dispenser des médicaments et conseiller les patients sur leur traitement.', 'Bac+6', 500000, 1000000, ['Rigueur', 'Chimie', 'Conseil', 'Gestion']),
            ('Infirmier', 'SANTE', 'Assurer les soins aux patients et soutenir le travail médical.', 'Bac+3', 300000, 600000, ['Empathie', 'Soins', 'Réactivité', 'Travail en équipe']),
            ('Sage-femme', 'SANTE', 'Accompagner les femmes pendant la grossesse, l\'accouchement et le post-partum.', 'Bac+3', 350000, 700000, ['Empathie', 'Soins', 'Réactivité', 'Gynécologie']),
            # TECH
            ('Développeur Full Stack', 'TECH', 'Concevoir et développer des applications web et mobiles de A à Z.', 'Bac+3', 400000, 1200000, ['Python', 'JavaScript', 'SQL', 'APIs']),
            ('Ingénieur IA / Data Scientist', 'TECH', 'Développer des modèles de machine learning pour résoudre des problèmes métier.', 'Bac+5', 600000, 2000000, ['Python', 'Machine Learning', 'Statistiques', 'Big Data']),
            ('Cybersécurité', 'TECH', 'Protéger les systèmes informatiques contre les attaques et les intrusions.', 'Bac+5', 600000, 1800000, ['Réseaux', 'Sécurité', 'Hacking éthique', 'Cryptographie']),
            ('Administrateur Systèmes & Réseaux', 'TECH', 'Gérer et maintenir les infrastructures informatiques d\'une organisation.', 'Bac+3', 350000, 800000, ['Linux', 'Réseaux', 'Cloud', 'Virtualisation']),
            ('Designer UX/UI', 'TECH', 'Concevoir des interfaces utilisateur intuitives et esthétiques.', 'Bac+3', 350000, 900000, ['Figma', 'Design', 'UX Research', 'Prototype']),
            # COMMERCE
            ('Expert-Comptable', 'COMMERCE', 'Gérer la comptabilité, l\'audit et le conseil fiscal pour les entreprises.', 'Bac+5', 500000, 1500000, ['Comptabilité', 'Audit', 'Fiscalité', 'Rigueur']),
            ('Manager Commercial', 'COMMERCE', 'Coordonner les équipes de vente et développer le chiffre d\'affaires.', 'Bac+5', 500000, 1200000, ['Vente', 'Leadership', 'Négociation', 'CRM']),
            ('Consultant en Management', 'COMMERCE', 'Accompagner les entreprises dans leur transformation et optimisation.', 'Bac+5', 700000, 2500000, ['Stratégie', 'Analyse', 'Communication', 'Gestion de projet']),
            ('Entrepreneur / Start-up', 'COMMERCE', 'Créer et développer une entreprise innovante dans un secteur porteur.', 'Variable', 0, 5000000, ['Vision', 'Leadership', 'Résilience', 'Marketing']),
            ('Responsable Marketing Digital', 'COMMERCE', 'Développer la présence en ligne et les stratégies de contenu d\'une marque.', 'Bac+3', 350000, 900000, ['SEO', 'Réseaux sociaux', 'Analytics', 'Contenu']),
            # DROIT
            ('Avocat', 'DROIT', 'Défendre les droits et intérêts des clients devant les tribunaux.', 'Bac+7', 500000, 3000000, ['Argumentation', 'Droit', 'Communication', 'Analyse']),
            ('Magistrat / Juge', 'DROIT', 'Rendre la justice au nom de l\'État dans les tribunaux et cours.', 'Bac+7', 700000, 1500000, ['Droit', 'Impartialité', 'Analyse', 'Rédaction']),
            ('Notaire', 'DROIT', 'Établir et authentifier des actes juridiques (ventes, contrats, testaments).', 'Bac+8', 800000, 2000000, ['Droit notarial', 'Rigueur', 'Rédaction', 'Confidentialité']),
            ('Juriste d\'Entreprise', 'DROIT', 'Conseiller une entreprise sur ses obligations légales et contrats commerciaux.', 'Bac+5', 450000, 1200000, ['Droit des affaires', 'Contrats', 'Négociation', 'Conformité']),
            # INGENIERIE
            ('Ingénieur Civil / BTP', 'INGENIERIE', 'Concevoir et superviser la construction d\'ouvrages (bâtiments, ponts, routes).', 'Bac+5', 500000, 1200000, ['Calcul', 'CAO/DAO', 'Gestion de projet', 'Physique']),
            ('Ingénieur Électricien', 'INGENIERIE', 'Concevoir des systèmes électriques pour l\'industrie et le bâtiment.', 'Bac+5', 450000, 1100000, ['Électricité', 'Électronique', 'AutoCAD', 'Automatismes']),
            ('Ingénieur Télécom', 'INGENIERIE', 'Développer et gérer les réseaux de communications (mobile, internet, satellite).', 'Bac+5', 500000, 1300000, ['Réseaux', 'Télécoms', '5G', 'Fibres optiques']),
            ('Ingénieur Agronome', 'INGENIERIE', 'Améliorer les techniques agricoles et gérer les ressources naturelles.', 'Bac+5', 400000, 900000, ['Agriculture', 'Biologie', 'Écologie', 'Gestion']),
            # EDUCATION
            ('Enseignant / Professeur', 'EDUCATION', 'Transmettre des connaissances et former les élèves dans sa discipline.', 'Bac+4', 250000, 600000, ['Pédagogie', 'Communication', 'Patience', 'Organisation']),
            ('Formateur / Coach', 'EDUCATION', 'Concevoir et animer des formations professionnelles pour adultes.', 'Bac+3', 300000, 800000, ['Pédagogie', 'Facilitation', 'Expertise métier', 'Communication']),
            # ARTS & CREATION
            ('Architecte', 'ARTS', 'Concevoir des bâtiments et espaces en alliant esthétique et fonctionnalité.', 'Bac+6', 450000, 1500000, ['Dessin', 'AutoCAD', 'Créativité', 'Gestion de projet']),
            ('Journaliste / Communicant', 'ARTS', 'Informer le public et produire des contenus médiatiques de qualité.', 'Bac+3', 300000, 800000, ['Rédaction', 'Investigation', 'Audiovisuel', 'Réseaux sociaux']),
            ('Infographiste / Motion Designer', 'ARTS', 'Créer des visuels et animations pour la communication digitale.', 'Bac+2', 250000, 700000, ['Photoshop', 'Illustrator', 'After Effects', 'Créativité']),
            # SCIENCES
            ('Biologiste / Chercheur', 'SCIENCES', 'Mener des recherches scientifiques pour approfondir la connaissance du vivant.', 'Bac+8', 400000, 1200000, ['Biologie', 'Recherche', 'Statistiques', 'Rédaction scientifique']),
            ('Géologue / Hydrologue', 'SCIENCES', 'Étudier les ressources du sous-sol (eau, minéraux, pétrole) et les risques naturels.', 'Bac+5', 500000, 1400000, ['Géologie', 'SIG', 'Terrain', 'Écologie']),
        ]

        careers = {}
        for name, cat, desc, edu, sal_entry, sal_5yr, skills in data:
            career, created = Career.objects.get_or_create(
                name=name,
                defaults={
                    'slug': slugify(name),
                    'description': desc,
                    'category': cat,
                    'required_education': edu,
                    'salary_entry': sal_entry,
                    'salary_5years': sal_5yr,
                    'skills': skills,
                    'market_demand': random.randint(3, 5),
                }
            )
            if created:
                CareerPath.objects.create(career=career, level='BAC', degree_name='Baccalauréat', duration_years=0, description='Obtenir le BAC (série S, L ou STEG selon le métier).')
                CareerPath.objects.create(career=career, level='LICENSE', degree_name='Licence (Bac+3)', duration_years=3, description='Formation de base dans la discipline. Théorie et premiers stages.')
                if edu not in ['Bac+3', 'Bac+2']:
                    CareerPath.objects.create(career=career, level='MASTER', degree_name='Master (Bac+5)', duration_years=2, description='Spécialisation avancée et mémoire de recherche.')
                if 'Bac+7' in edu or 'Bac+8' in edu or 'Bac+11' in edu:
                    CareerPath.objects.create(career=career, level='DOCTORAT', degree_name='Doctorat / Spécialisation', duration_years=3, description='Formation de haut niveau, recherche ou spécialisation clinique.')
            careers[name] = career

        self.stdout.write(f'  ✓ {len(careers)} métiers créés')
        return careers

    def _seed_universities(self, countries):
        unis = [
            # Sénégal
            ('UCAD - Université Cheikh Anta Diop', 'Sénégal', 'Dakar', 'PUBLIC', 75000, 0.65),
            ('UGB - Université Gaston Berger', 'Sénégal', 'Saint-Louis', 'PUBLIC', 75000, 0.70),
            ('UASZ - Université Assane Seck', 'Sénégal', 'Ziguinchor', 'PUBLIC', 75000, 0.75),
            ('UDM - Université de Diourbel', 'Sénégal', 'Diourbel', 'PUBLIC', 60000, 0.80),
            ('ISM - Institut Supérieur de Management', 'Sénégal', 'Dakar', 'PRIVATE', 1500000, 0.55),
            ('IUT de Dakar', 'Sénégal', 'Dakar', 'PUBLIC', 80000, 0.60),
            ('EPT - École Polytechnique de Thiès', 'Sénégal', 'Thiès', 'PUBLIC', 90000, 0.40),
            ('ESMT - École Supérieure Multinationale des Télécoms', 'Sénégal', 'Dakar', 'PRIVATE', 2000000, 0.45),
            ('UFR Santé de Dakar', 'Sénégal', 'Dakar', 'PUBLIC', 100000, 0.30),
            ('USSEIN - Université du Sine Saloum', 'Sénégal', 'Kaolack', 'PUBLIC', 60000, 0.78),
            # France
            ('Sorbonne Université', 'France', 'Paris', 'PUBLIC', 170000, 0.60),
            ('Université Paris-Saclay', 'France', 'Gif-sur-Yvette', 'PUBLIC', 170000, 0.45),
            ('Université de Lyon', 'France', 'Lyon', 'PUBLIC', 170000, 0.65),
            ('Université de Bordeaux', 'France', 'Bordeaux', 'PUBLIC', 170000, 0.70),
            ('Université de Strasbourg', 'France', 'Strasbourg', 'PUBLIC', 170000, 0.68),
            ('CY Cergy Paris Université', 'France', 'Cergy', 'PUBLIC', 170000, 0.72),
            ('Université de Montpellier', 'France', 'Montpellier', 'PUBLIC', 170000, 0.66),
            ('IESEG School of Management', 'France', 'Lille', 'PRIVATE', 900000, 0.35),
            # Canada
            ('Université de Montréal', 'Canada', 'Montréal', 'PUBLIC', 1200000, 0.55),
            ('Université Laval', 'Canada', 'Québec', 'PUBLIC', 1100000, 0.60),
            ('Université de Sherbrooke', 'Canada', 'Sherbrooke', 'PUBLIC', 1000000, 0.62),
            ('Université du Québec à Montréal (UQAM)', 'Canada', 'Montréal', 'PUBLIC', 950000, 0.65),
            ('HEC Montréal', 'Canada', 'Montréal', 'PUBLIC', 1300000, 0.45),
            # Maroc
            ('Université Mohammed V', 'Maroc', 'Rabat', 'PUBLIC', 200000, 0.60),
            ('Université Hassan II', 'Maroc', 'Casablanca', 'PUBLIC', 200000, 0.62),
            ('Université Cади Ayyad', 'Maroc', 'Marrakech', 'PUBLIC', 200000, 0.65),
            ('ENCG Casablanca', 'Maroc', 'Casablanca', 'PUBLIC', 300000, 0.35),
            ('UIR - Université Internationale de Rabat', 'Maroc', 'Rabat', 'PRIVATE', 700000, 0.50),
            # Tunisie
            ('Université de Tunis El Manar', 'Tunisie', 'Tunis', 'PUBLIC', 150000, 0.58),
            ('IHEC Carthage', 'Tunisie', 'Carthage', 'PUBLIC', 200000, 0.40),
            ('Université de Sfax', 'Tunisie', 'Sfax', 'PUBLIC', 150000, 0.65),
            # Belgique
            ('Université Libre de Bruxelles (ULB)', 'Belgique', 'Bruxelles', 'PUBLIC', 180000, 0.55),
            ('UCLouvain', 'Belgique', 'Louvain-la-Neuve', 'PUBLIC', 180000, 0.50),
            ('Université de Liège', 'Belgique', 'Liège', 'PUBLIC', 170000, 0.62),
            # Allemagne
            ('LMU Munich', 'Allemagne', 'Munich', 'PUBLIC', 50000, 0.40),
            ('TU Berlin', 'Allemagne', 'Berlin', 'PUBLIC', 50000, 0.42),
            ('Université de Heidelberg', 'Allemagne', 'Heidelberg', 'PUBLIC', 50000, 0.45),
            # Espagne
            ('Université de Barcelone', 'Espagne', 'Barcelone', 'PUBLIC', 160000, 0.65),
            ('Université Complutense de Madrid', 'Espagne', 'Madrid', 'PUBLIC', 160000, 0.60),
            # Côte d'Ivoire
            ("Université Félix Houphouët-Boigny", "Côte d'Ivoire", 'Abidjan', 'PUBLIC', 100000, 0.70),
            ("INP-HB Yamoussoukro", "Côte d'Ivoire", 'Yamoussoukro', 'PUBLIC', 200000, 0.38),
            # Cameroun
            ('Université de Yaoundé I', 'Cameroun', 'Yaoundé', 'PUBLIC', 80000, 0.68),
            ('Université de Douala', 'Cameroun', 'Douala', 'PUBLIC', 80000, 0.72),
            # Gabon
            ('Université Omar Bongo', 'Gabon', 'Libreville', 'PUBLIC', 120000, 0.65),
            # Ghana
            ('University of Ghana', 'Ghana', 'Accra', 'PUBLIC', 500000, 0.52),
            ('KNUST', 'Ghana', 'Kumasi', 'PUBLIC', 500000, 0.48),
            # États-Unis
            ('Howard University', 'États-Unis', 'Washington DC', 'PRIVATE', 2500000, 0.35),
            # Portugal
            ('Université de Lisbonne', 'Portugal', 'Lisbonne', 'PUBLIC', 140000, 0.62),
            ('Université de Porto', 'Portugal', 'Porto', 'PUBLIC', 140000, 0.60),
            # Mauritanie
            ('Université de Nouakchott', 'Mauritanie', 'Nouakchott', 'PUBLIC', 90000, 0.75),
        ]
        count = 0
        for name, country_name, city, utype, tuition, rate in unis:
            if country_name in countries:
                University.objects.get_or_create(
                    name=name, country=countries[country_name],
                    defaults={
                        'city': city, 'type': utype,
                        'tuition_fees_min': tuition, 'tuition_fees_max': int(tuition * 1.5),
                        'website': 'https://example.edu',
                        'acceptance_rate': rate,
                        'required_documents': ['Relevés de notes', 'Lettre de motivation', 'Passeport'],
                        'admission_procedure': 'Dossier académique + entretien',
                    }
                )
                count += 1
        self.stdout.write(f'  ✓ {count} universités créées')

    def _seed_scholarships(self, countries, careers):
        # Convert to list for random access
        career_list = list(careers.values())
        data = [
            ('Bourse d\'Excellence CROUS', 'Gouvernement Français', 'France', 'MASTER', 100, True, True, '2026-05-30', 'https://campusfrance.org'),
            ('Bourse AMU Sénégal', 'Agence des Muslmans pour l\'Université', 'Sénégal', 'LICENSE', 80, True, False, '2026-04-15', 'https://example.org'),
            ('Bourse de la Coopération Canadienne', 'Gouvernement du Canada', 'Canada', 'MASTER', 100, True, True, '2026-03-31', 'https://canada.ca'),
            ('DAAD Scholarship Germany', 'Service Allemand d\'Échanges', 'Allemagne', 'MASTER', 100, True, True, '2026-04-30', 'https://daad.de'),
            ('Bourse Roi Mohammed VI', 'Gouvernement Marocain', 'Maroc', 'LICENSE', 100, True, True, '2026-05-15', 'https://bourses.ma'),
            ('Bourse UCAD Excellence', 'UCAD', 'Sénégal', 'LICENSE', 50, True, False, '2026-06-30', 'https://ucad.sn'),
            ('EduFrance Afrique', 'Campus France', 'France', 'LICENSE', 100, True, True, '2026-04-01', 'https://campusfrance.org'),
            ('ERASMUS+ Mobilité', 'Union Européenne', 'Belgique', 'MASTER', 100, True, True, '2026-03-15', 'https://erasmus.eu'),
            ('Bourse Eiffel', 'Gouvernement Français', 'France', 'DOCTORAT', 100, True, True, '2026-01-15', 'https://campusfrance.org'),
            ('Bourse Jeunes Leaders Sénégal', 'USAID Sénégal', 'États-Unis', 'MASTER', 100, True, True, '2026-07-01', 'https://usaid.gov'),
            ('Bourses OIF Francophonie', 'Organisation Internationale Francophonie', 'Canada', 'DOCTORAT', 80, True, True, '2026-05-01', 'https://oif.org'),
            ('African Leadership Academy Scholarship', 'ALA Foundation', 'Ghana', 'LICENSE', 100, True, True, '2026-06-15', 'https://ala.ac'),
            ('Bourse UEMOA', 'Union Économique et Monétaire Ouest Africaine', 'Côte d\'Ivoire', 'MASTER', 60, True, False, '2026-08-01', 'https://uemoa.int'),
            ('Bourse de la Banque Mondiale', 'Banque Mondiale', 'États-Unis', 'DOCTORAT', 100, True, True, '2026-02-28', 'https://worldbank.org'),
            ('EPT Merit Award', 'École Polytechnique de Thiès', 'Sénégal', 'LICENSE', 100, True, False, '2026-09-01', 'https://ept.sn'),
        ]
        count = 0
        for name, provider, country_name, level, cov, tuition, living, deadline, link in data:
            if country_name in countries:
                sch, created = Scholarship.objects.get_or_create(
                    name=name,
                    defaults={
                        'provider': provider,
                        'country': countries[country_name],
                        'level': level,
                        'coverage_percent': cov,
                        'covers_tuition': tuition,
                        'covers_living': living,
                        'deadline': deadline,
                        'application_link': link,
                        'required_documents': ['Passport', 'Relevés de notes', 'Lettre de motivation', 'CV'],
                        'nationality_requirements': ['Sénégalais'],
                    }
                )
                if created:
                    sch.fields.set(random.sample(career_list, min(3, len(career_list))))
                count += 1
        self.stdout.write(f'  ✓ {count} bourses créées')

    def _seed_questions(self):
        questions = [
            ('INTERESTS', 'Aides-tu souvent les autres autour de toi (famille, amis, voisins) ?', 'SCALE', [], {'SANTE': 1.0, 'EDUCATION': 0.5}),
            ('INTERESTS', 'Passes-tu du temps à coder, bidouiller des appareils ou apprendre des logiciels ?', 'SCALE', [], {'TECH': 1.2, 'INGENIERIE': 0.4}),
            ('INTERESTS', 'La justice, le droit et la défense des droits te passionnent-ils ?', 'SCALE', [], {'DROIT': 1.2}),
            ('INTERESTS', 'Aimes-tu négocier, convaincre et vendre des idées ou produits ?', 'SCALE', [], {'COMMERCE': 1.2}),
            ('INTERESTS', 'Aimes-tu construire, dessiner des plans ou créer des objets ?', 'SCALE', [], {'INGENIERIE': 1.0, 'ARTS': 0.5}),
            ('INTERESTS', 'Aimes-tu enseigner et expliquer des choses aux autres ?', 'SCALE', [], {'EDUCATION': 1.2, 'SANTE': 0.3}),
            ('ACADEMIC', 'Quelle est ta matière préférée au lycée ?', 'SINGLE',
             ['Mathématiques', 'Sciences de la vie (SVT/PC)', 'Français / Lettres', 'Histoire-Géographie', 'Économie / Gestion', 'Arts / Dessin'],
             {'Mathématiques': {'TECH': 2, 'INGENIERIE': 2, 'COMMERCE': 1},
              'Sciences de la vie (SVT/PC)': {'SANTE': 3, 'SCIENCES': 2},
              'Français / Lettres': {'DROIT': 2, 'EDUCATION': 1, 'ARTS': 1},
              'Histoire-Géographie': {'DROIT': 1, 'EDUCATION': 1},
              'Économie / Gestion': {'COMMERCE': 2, 'DROIT': 1},
              'Arts / Dessin': {'ARTS': 3}}),
            ('ACADEMIC', 'Quelle est ta série au baccalauréat (ou prévue) ?', 'SINGLE',
             ['Série S (Sciences)', 'Série L (Lettres)', 'Série STEG (Économie)', 'Série L2 (Arabe)', 'Autre'],
             {'Série S (Sciences)': {'SANTE': 2, 'TECH': 2, 'INGENIERIE': 2, 'SCIENCES': 2},
              'Série L (Lettres)': {'DROIT': 2, 'ARTS': 1, 'EDUCATION': 1},
              'Série STEG (Économie)': {'COMMERCE': 2, 'DROIT': 1},
              'Série L2 (Arabe)': {'DROIT': 1, 'EDUCATION': 1},
              'Autre': {}}),
            ('PERSONALITY', 'Comment te comportes-tu dans un groupe de travail ?', 'SINGLE',
             ['Je prends les décisions et je dirige', 'J\'aide et je soutiens les autres', 'J\'analyse et je résous les problèmes', 'Je crée et propose des idées'],
             {'Je prends les décisions et je dirige': {'COMMERCE': 2, 'DROIT': 1},
              'J\'aide et je soutiens les autres': {'SANTE': 2, 'EDUCATION': 1},
              'J\'analyse et je résous les problèmes': {'TECH': 2, 'INGENIERIE': 2, 'SCIENCES': 1},
              'Je crée et propose des idées': {'ARTS': 2, 'TECH': 1}}),
            ('PERSONALITY', 'Face à un problème difficile, ta réaction est...', 'SINGLE',
             ['Je cherche la règle ou la loi applicable', 'Je teste plusieurs solutions jusqu\'à trouver', 'Je demande l\'avis d\'experts', 'Je cherche une solution créative originale'],
             {'Je cherche la règle ou la loi applicable': {'DROIT': 2},
              'Je teste plusieurs solutions jusqu\'à trouver': {'TECH': 2, 'INGENIERIE': 1},
              'Je demande l\'avis d\'experts': {'SANTE': 1, 'COMMERCE': 1},
              'Je cherche une solution créative originale': {'ARTS': 2, 'TECH': 1}}),
            ('PERSONALITY', 'Dans 10 ans, tu te vois...', 'SINGLE',
             ['Dans un grand hôpital à soigner des patients', 'À la tête de ta propre entreprise', 'Dans un tribunal ou cabinet juridique', 'Devant un ordinateur à créer des produits digitaux', 'Sur un chantier ou dans un laboratoire', 'Debout devant une classe à enseigner'],
             {'Dans un grand hôpital à soigner des patients': {'SANTE': 3},
              'À la tête de ta propre entreprise': {'COMMERCE': 3},
              'Dans un tribunal ou cabinet juridique': {'DROIT': 3},
              'Devant un ordinateur à créer des produits digitaux': {'TECH': 3},
              'Sur un chantier ou dans un laboratoire': {'INGENIERIE': 2, 'SCIENCES': 1},
              'Debout devant une classe à enseigner': {'EDUCATION': 3}}),
            ('SKILLS', 'Quel est ton niveau en mathématiques ?', 'SCALE', [], {'TECH': 0.8, 'INGENIERIE': 0.8, 'SCIENCES': 0.6, 'COMMERCE': 0.4}),
            ('SKILLS', 'À quel point es-tu à l\'aise avec les sciences biologiques ?', 'SCALE', [], {'SANTE': 1.0, 'SCIENCES': 0.7}),
            ('SKILLS', 'À quel point maîtrises-tu un langage de programmation ou du code ?', 'SCALE', [], {'TECH': 1.2}),
            ('SKILLS', 'Es-tu à l\'aise pour t\'exprimer et argumenter à l\'oral ou à l\'écrit ?', 'SCALE', [], {'DROIT': 1.0, 'EDUCATION': 0.8, 'COMMERCE': 0.6, 'ARTS': 0.5}),
            ('VALUES', 'Qu\'est-ce qui est le plus important pour toi dans ton futur métier ?', 'SINGLE',
             ['Aider et soigner les gens', 'Gagner beaucoup d\'argent', 'Avoir un impact sur la société', 'Créer et innover', 'Voyager et travailler à l\'international'],
             {'Aider et soigner les gens': {'SANTE': 2, 'EDUCATION': 1},
              'Gagner beaucoup d\'argent': {'COMMERCE': 2, 'DROIT': 1},
              'Avoir un impact sur la société': {'DROIT': 1, 'INGENIERIE': 1, 'SCIENCES': 1},
              'Créer et innover': {'TECH': 2, 'ARTS': 1},
              'Voyager et travailler à l\'international': {'COMMERCE': 1, 'TECH': 1}}),
            ('VALUES', 'Quel secteur d\'activité t\'attire le plus ?', 'SINGLE',
             ['Santé & Médecine', 'Technologie & Numérique', 'Droit & Justice', 'Business & Finance', 'Ingénierie & Construction', 'Éducation & Recherche', 'Medias & Créativité'],
             {'Santé & Médecine': {'SANTE': 3},
              'Technologie & Numérique': {'TECH': 3},
              'Droit & Justice': {'DROIT': 3},
              'Business & Finance': {'COMMERCE': 3},
              'Ingénierie & Construction': {'INGENIERIE': 3},
              'Éducation & Recherche': {'EDUCATION': 2, 'SCIENCES': 1},
              'Medias & Créativité': {'ARTS': 3}}),
            ('VALUES', 'Combien d\'années d\'études supplémentaires es-tu prêt(e) à faire après le BAC ?', 'SINGLE',
             ['2-3 ans (Licence, DUT)', '4-5 ans (Master)', '6-7 ans (spécialisation)', '8 ans et plus (Doctorat, Médecine)'],
             {'2-3 ans (Licence, DUT)': {'TECH': 1, 'ARTS': 1, 'EDUCATION': 1},
              '4-5 ans (Master)': {'COMMERCE': 1, 'INGENIERIE': 1, 'DROIT': 1},
              '6-7 ans (spécialisation)': {'DROIT': 2, 'SANTE': 1},
              '8 ans et plus (Doctorat, Médecine)': {'SANTE': 2, 'SCIENCES': 2}}),
            ('SKILLS', 'À quel point es-tu organisé(e) et rigoureux(se) dans ton travail quotidien ?', 'SCALE', [], {'SANTE': 0.5, 'INGENIERIE': 0.6, 'COMMERCE': 0.5}),
            ('INTERESTS', 'Est-ce que tu aimes expérimenter, tester des hypothèses et Observer des résultats ?', 'SCALE', [], {'SCIENCES': 1.2, 'TECH': 0.5, 'SANTE': 0.3}),
        ]
        count = 0
        for i, (section, text, qtype, opts, mapping) in enumerate(questions):
            OrientationQuestion.objects.get_or_create(
                question_text=text,
                defaults={
                    'section': section, 'question_type': qtype,
                    'options': opts, 'order': i, 'category_mapping': mapping
                }
            )
            count += 1
        self.stdout.write(f'  ✓ {count} questions d\'orientation créées')

    def _seed_opportunities(self, admin):
        today = date.today()
        opps = [
            ('Concours National d\'Informatique (CNI) 2026', 'CONCOURS', 'TECH', 'Ministère de l\'Éducation', 'Concours inter-lycéens pour les passionnés d\'informatique et de programmation. Prix : matériel informatique + bourse d\'études.', today + timedelta(days=45), 'Matériel + Bourse 500 000 FCFA'),
            ('Bourse STEM Girls Sénégal', 'PROGRAM', 'SANTE', 'GIZ Sénégal', 'Programme de bourses pour filles en séries scientifiques souhaitant s\'orienter en STEM. Financement total + mentorat.', today + timedelta(days=30), 'Financement total + accompagnement'),
            ('Forum Étudiant Campus France Dakar', 'EVENT', 'ALL', 'Campus France Sénégal', 'Salon annuel pour rencontrer les universités françaises et obtenir des informations sur les bourses Eiffel et CROUS.', today + timedelta(days=15), None),
            ('Stage d\'été en Développement Web - Dakar Digital', 'STAGE', 'TECH', 'Dakar Digital Hub', 'Stage de 3 mois pour étudiants en informatique. Missions réelles sur des projets e-commerce. Indemnité mensuelle.', today + timedelta(days=60), 'Indemnité 150 000 FCFA/mois'),
            ('Challenge Entrepreneuriat Jeunes Afrique 2026', 'COMPETITION', 'COMMERCE', 'Jeune Afrique Group', 'Compétition ouverte aux 18-30 ans pour la meilleure idée de startup africaine. Prix de 5 millions FCFA.', today + timedelta(days=90), '5 000 000 FCFA + mentorat'),
            ('Séminaire Droit International Humanitaire - CICR', 'EVENT', 'DROIT', 'Croix-Rouge Internationale', 'Formation intensive de 5 jours sur le droit humanitaire. Ouvert aux étudiants en droit.', today + timedelta(days=20), 'Participation gratuite + certificat'),
            ('Concours d\'Architecture LEED Sénégal', 'COMPETITION', 'ARTS', 'Ordre des Architectes du Sénégal', 'Concours de design pour étudiants en architecture sur le thème de l\'habitat durable en Afrique.', today + timedelta(days=75), 'Prix + stage professionnel'),
            ('Programme Volontariat Santé Communautaire', 'PROGRAM', 'SANTE', 'OMS Sénégal', 'Programme de volontariat de 6 mois dans des centres de santé communautaires. Formation sur le terrain incluse.', today + timedelta(days=40), 'Allocation mensuelle + formation'),
        ]
        count = 0
        for title, otype, cat, org, desc, deadline, prize in opps:
            Opportunity.objects.get_or_create(
                title=title,
                defaults={
                    'type': otype, 'category': cat, 'organizer': org,
                    'description': desc, 'deadline': deadline,
                    'prize': prize or '', 'posted_by': admin,
                    'is_approved': True, 'is_verified': True,
                    'target_audience': ['Terminale', 'Licence', 'Master'],
                }
            )
            count += 1
        self.stdout.write(f'  ✓ {count} opportunités créées')
