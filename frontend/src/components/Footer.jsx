const Footer = () => {
  return (
    <footer className="bg-premium-dark border-t border-slate-800 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <span className="text-2xl font-bold tracking-tight">
              TAKKU <span className="text-senegal-green">AVENIR</span>
            </span>
            <p className="mt-4 text-slate-400 max-w-sm">
              La plateforme d'orientation n°1 au Sénégal. Nous accompagnons les étudiants vers les meilleures opportunités académiques et professionnelles.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-white mb-4">Plateforme</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="/careers" className="hover:text-white transition-colors">Test d'orientation</a></li>
              <li><a href="/universities" className="hover:text-white transition-colors">Universités</a></li>
              <li><a href="/scholarships" className="hover:text-white transition-colors">Bourses</a></li>
              <li><a href="/opportunities" className="hover:text-white transition-colors">Opportunités</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-white mb-4">Contact</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>Dakar, Sénégal</li>
              <li>contact@takkuavenir.sn</li>
              <li>+221 33 000 00 00</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-slate-800 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} TAKKU AVENIR. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
