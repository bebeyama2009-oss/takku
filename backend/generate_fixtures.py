import json
import os

def generate_careers():
    categories = ['SANTE', 'TECH', 'COMMERCE', 'DROIT', 'ENSEIGNEMENT', 'ARTS', 'INGENIERIE', 'AUTRE']
    career_names = [
        ("Médecin Généraliste", "SANTE", "Médecine"),
        ("Développeur Fullstack", "TECH", "Informatique"),
        ("Expert Comptable", "COMMERCE", "Comptabilité"),
        ("Avocat", "DROIT", "Droit"),
        ("Professeur de Lycée", "ENSEIGNEMENT", "Éducation"),
        ("Architecte", "ARTS", "Architecture"),
        ("Ingénieur Civil", "INGENIERIE", "Génie Civil"),
        ("Infirmier", "SANTE", "Sciences Infirmières"),
        ("Data Scientist", "TECH", "Mathématiques/Informatique"),
        ("Manager Marketing", "COMMERCE", "Marketing"),
        ("Magistrat", "DROIT", "Droit"),
        ("Chercheur Senior", "ENSEIGNEMENT", "Sciences"),
        ("Designer UX/UI", "ARTS", "Arts Numériques"),
        ("Ingénieur Réseaux", "TECH", "Télécoms"),
        ("Pharmacien", "SANTE", "Pharmacie"),
        ("Auditeur Financier", "COMMERCE", "Finance"),
        ("Notaire", "DROIT", "Droit"),
        ("Psychologue", "SANTE", "Psychologie"),
        ("Ingénieur Aéronautique", "INGENIERIE", "Aéronautique"),
        ("Journaliste", "AUTRE", "Journalisme"),
        ("Drh", "COMMERCE", "Ressources Humaines"),
        ("Dentiste", "SANTE", "Odontologie"),
        ("Vétérinaire", "SANTE", "Médecine Vétérinaire"),
        ("Cybersecurity Analyst", "TECH", "Sécurité Informatique"),
        ("Ingénieur Agronome", "INGENIERIE", "Agronomie"),
        ("Geologue", "INGENIERIE", "Géologie"),
        ("Interprète", "AUTRE", "Langues"),
        ("Pilote de Ligne", "AUTRE", "Aviation"),
        ("Actuaire", "COMMERCE", "Statistiques"),
        ("Urbaniste", "ARTS", "Urbanisme")
    ]
    
    fixtures = []
    career_paths = []
    
    for i, (name, cat, edu) in enumerate(career_names, 1):
        slug = name.lower().replace(" ", "-").replace("/", "-").replace("é", "e").replace("è", "e").replace("ê", "e")
        fixtures.append({
            "model": "careers.career",
            "pk": i,
            "fields": {
                "name": name,
                "slug": slug,
                "description": f"En tant que {name}, vous jouerez un rôle crucial dans le secteur de {cat.lower()}.",
                "category": cat,
                "required_education": edu,
                "salary_entry": 250000 + (i * 10000),
                "salary_5years": 600000 + (i * 20000),
                "skills": ["Analyse", "Communication", "Organisation"],
                "market_demand": 4 if i % 2 == 0 else 3
            }
        })
        
        # Paths for each career
        levels = [("BAC", "Baccalauréat", 0), ("LICENSE", "Licence", 3), ("MASTER", "Master", 2)]
        for j, (lvl, dname, dur) in enumerate(levels, 1):
            career_paths.append({
                "model": "careers.careerpath",
                "pk": (i-1)*3 + j,
                "fields": {
                    "career": i,
                    "level": lvl,
                    "degree_name": f"{dname} en {edu}",
                    "duration_years": dur if lvl != "BAC" else 3,
                    "description": f"Étape {lvl} pour devenir {name}.",
                    "available_senegal": True,
                    "available_countries": ["Sénégal", "France", "Canada"],
                    "requirements": {"bac": "S1, S2, L" if cat in ["SANTE", "INGENIERIE", "TECH"] else "L, S"}
                }
            })
            
    return fixtures + career_paths

def generate_countries():
    countries_data = [
        ("Sénégal", "🇸🇳", "Français/Wolof", "FCFA", 100000, 500000, 150000, False, ""),
        ("France", "🇫🇷", "Français", "Euro", 200000, 8000000, 600000, True, "TCF/DELF"),
        ("Canada", "🇨🇦", "Anglais/Français", "CAD", 5000000, 20000000, 800000, True, "TEF/IELTS"),
        ("Maroc", "🇲🇦", "Arabe/Français", "Dirham", 300000, 2000000, 250000, True, ""),
        ("Tunisie", "🇹🇳", "Arabe/Français", "Dinar", 300000, 1500000, 200000, True, ""),
        ("Côte d'Ivoire", "🇨🇮", "Français", "FCFA", 150000, 600000, 180000, False, ""),
        ("USA", "🇺🇸", "Anglais", "USD", 10000000, 40000000, 1000000, True, "TOEFL/IELTS"),
        ("Allemagne", "DE", "Allemand", "Euro", 0, 500000, 600000, True, "TestDaF"),
        ("Belgique", "BE", "Français/Néerlandais", "Euro", 500000, 3000000, 600000, True, ""),
        ("UK", "🇬🇧", "Anglais", "GBP", 8000000, 20000000, 900000, True, "IELTS"),
        ("Espagne", "ES", "Espagnol", "Euro", 500000, 3000000, 500000, True, "DELE"),
        ("Turquie", "TR", "Turc", "Lira", 200000, 1000000, 200000, True, "TOMER"),
        ("Émirats", "AE", "Arabe/Anglais", "Dirham", 5000000, 15000000, 800000, True, "IELTS"),
        ("Chine", "CN", "Chinois", "Yuan", 1000000, 4000000, 300000, True, "HSK"),
        ("Inde", "IN", "Hindi/Anglais", "Rupee", 500000, 2000000, 150000, True, "")
    ]
    
    fixtures = []
    for i, data in enumerate(countries_data, 1):
        fixtures.append({
            "model": "universities.country",
            "pk": i,
            "fields": {
                "name": data[0],
                "flag_emoji": data[1],
                "language": data[2],
                "currency": data[3],
                "average_tuition_public": data[4],
                "average_tuition_private": data[5],
                "living_cost_monthly": data[6],
                "visa_required": data[7],
                "language_test_required": data[8]
            }
        })
    return fixtures

def generate_universities(countries):
    fixtures = []
    programs = []
    
    univ_names = [
        "Université Cheikh Anta Diop (UCAD)", "Université Gaston Berger (UGB)", "ESMT", "BEM Dakar", "ISM",
        "Sorbonne Université", "HEC Paris", "Polytechnique Montréal", "Université d'Ottawa", "Université de Carthage",
        "Université Hassan II", "Al Akhawayn", "INPHB Yamoussoukro", "Harvard University", "MIT",
        "TU Munich", "Lomonosov Moscow", "Tsinghua University", "University of Tokyo", "Sapienza Roma",
        "Universidad Complutense", "National University of Singapore", "ETH Zurich", "London School of Economics", "Dauphine Paris"
    ]
    
    # Let's generate 50 universities (roughly 2-3 per country)
    for i in range(1, 51):
        country_pk = (i % 15) + 1
        fixtures.append({
            "model": "universities.university",
            "pk": i,
            "fields": {
                "name": f"{univ_names[i % len(univ_names)]} - Campus {i}",
                "country": country_pk,
                "city": "Capitale" if i % 2 == 0 else "Ville Universitaire",
                "type": "PUBLIC" if i % 3 != 0 else "PRIVATE",
                "is_partner": True if i % 10 == 0 else False,
                "tuition_fees_min": 50000 if country_pk == 1 else 500000,
                "tuition_fees_max": 200000 if country_pk == 1 else 5000000,
                "application_fee": 10000 if country_pk == 1 else 50000,
                "living_cost_monthly": 150000 if country_pk == 1 else 600000,
                "academic_year_start": "2026-10-01",
                "application_deadline": "2026-06-30",
                "required_documents": ["BAC", "Relevés de notes", "ID", "Photo"],
                "admission_procedure": "Dossier + Test",
                "website": "http://example.org",
                "email": "info@example.org",
                "phone": "+221 33 000 00 00",
                "acceptance_rate": 15.00
            }
        })
        
        # 3 programs per university
        prog_types = [("LICENSE", "Licence", 3), ("MASTER", "Master", 2), ("DOCTORAT", "Doctorat", 3)]
        for j, (lvl, lname, dur) in enumerate(prog_types, 1):
            programs.append({
                "model": "universities.program",
                "pk": (i-1)*3 + j,
                "fields": {
                    "university": i,
                    "name": f"{lname} en Science/Gestion {i}",
                    "level": lvl,
                    "duration_years": dur,
                    "tuition_fees": 100000 * j,
                    "requirements": {"bac": "Toutes séries"}
                }
            })
            
    return fixtures + programs

def generate_scholarships(countries, careers):
    fixtures = []
    for i in range(1, 51):
        country_pk = (i % 15) + 1
        career_pks = [ (i % 30) + 1, ((i+5) % 30) + 1 ]
        fixtures.append({
            "model": "scholarships.scholarship",
            "pk": i,
            "fields": {
                "name": f"Bourse d'Excellence {i}",
                "provider": "Gouvernement ou Fondation",
                "country": country_pk,
                "level": "LICENSE" if i % 2 == 0 else "MASTER",
                "fields": career_pks,
                "coverage_percent": 100 if i % 5 == 0 else 50,
                "amount": 5000000,
                "covers_tuition": True,
                "covers_living": True if i % 4 == 0 else False,
                "min_gpa": 3.5 if i % 2 == 0 else 3.0,
                "age_limit": 25,
                "nationality_requirements": ["Sénégalaise"],
                "financial_need_required": True if i % 3 == 0 else False,
                "deadline": "2026-05-15",
                "application_link": "https://scholarship.gov",
                "required_documents": ["BAC", "ID"],
                "selection_rate": 5.00
            }
        })
    return fixtures

def generate_orientation():
    fixtures = []
    questions = [
        ("Aimez-vous résoudre des problèmes logiques et mathématiques ?", "INTERESTS", "SCALE"),
        ("Préférez-vous travailler en équipe ou de manière autonome ?", "INTERESTS", "SINGLE", ["Équipe", "Autonome", "Mixte"]),
        ("Quel secteur vous attire le plus ?", "ASPIRATIONS", "SINGLE", ["Santé", "Technologie", "Business", "Création", "Social"]),
        ("Combien d'années d'études êtes-vous prêt à faire ?", "ACADEMIC", "SINGLE", ["2-3 ans", "5 ans", "8 ans et plus"]),
        ("Quelle est votre série au BAC ?", "ACADEMIC", "SINGLE", ["S1", "S2", "L", "G", "T"]),
        ("Êtes-vous intéressé par l'entreprenariat ?", "ASPIRATIONS", "SCALE"),
        ("Aimez-vous aider les autres directement ?", "INTERESTS", "SCALE"),
        ("Préférez-vous travailler à l'extérieur ou dans un bureau ?", "INTERESTS", "SINGLE", ["Extérieur", "Bureau", "Télétravail"]),
        ("Quel est votre niveau d'anglais ?", "ACADEMIC", "SINGLE", ["Débutant", "Intermédiaire", "Avancé"]),
        ("Voulez-vous étudier au Sénégal ou à l'étranger ?", "ASPIRATIONS", "SINGLE", ["Sénégal", "Étranger", "Indifférent"]),
        ("Aimez-vous les arts et la culture ?", "INTERESTS", "SCALE"),
        ("Êtes-vous à l'aise avec la technologie ?", "INTERESTS", "SCALE"),
        ("Préférez-vous les sciences exactes ou les sciences humaines ?", "ACADEMIC", "SINGLE", ["Sciences exactes", "Sciences humaines"]),
        ("Avez-vous le sens du détail ?", "INTERESTS", "SCALE"),
        ("Le salaire est-il votre priorité numéro 1 ?", "ASPIRATIONS", "SCALE"),
        ("Aimez-vous lire et écrire ?", "INTERESTS", "SCALE"),
        ("Êtes-vous agile de vos mains (travaux manuels) ?", "INTERESTS", "SCALE"),
        ("Aimez-vous diriger et organiser ?", "INTERESTS", "SCALE"),
        ("Êtes-vous prêt à voyager souvent ?", "ASPIRATIONS", "SCALE"),
        ("Quel est votre budget annuel environ pour les études ?", "ASPIRATIONS", "SINGLE", ["Moins de 1M", "1M - 5M", "Plus de 5M"])
    ]
    
    for i, q in enumerate(questions, 1):
        q_text, section, q_type = q[0], q[1], q[2]
        options = q[3] if len(q) > 3 else []
        fixtures.append({
            "model": "orientation.orientationquestion",
            "pk": i,
            "fields": {
                "section": section,
                "question_text": q_text,
                "question_type": q_type,
                "options": options,
                "order": i,
                "weight": 1.0,
                "category_mapping": {"Option 1": {"TECH": 5}} if options else {}
            }
        })
    return fixtures

def main():
    careers = generate_careers()
    countries = generate_countries()
    universities = generate_universities(countries)
    scholarships = generate_scholarships(countries, careers)
    orientation = generate_orientation()
    
    all_fixtures = careers + countries + universities + scholarships + orientation
    
    with open('all_fixtures.json', 'w', encoding='utf-8') as f:
        json.dump(all_fixtures, f, ensure_ascii=False, indent=4)
        
    print(f"Generated {len(all_fixtures)} fixture entries.")

if __name__ == "__main__":
    main()
