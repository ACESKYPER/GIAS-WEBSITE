export default function LegalPage() {
  return (
    <div className="min-h-screen">
      <section className="bg-white border-b border-slate-200">
        <div className="container-max py-16">
          <h1 className="text-5xl font-serif mb-6">Legal</h1>
          <p className="text-slate-600">Privacy, terms, and legal information for GIAS Institute.</p>
        </div>
      </section>

      <section className="container-max py-16">
        <div className="max-w-3xl">
          <h2 className="text-3xl font-serif mb-8">Terms of Service</h2>
          <p className="text-slate-600 mb-6">
            GIAS Institute provides standards, certifications, and attestations for AI systems. 
            By using our services, you agree to comply with these terms.
          </p>

          <h2 className="text-3xl font-serif mb-8 mt-12">Privacy Policy</h2>
          <p className="text-slate-600 mb-6">
            We collect and process data in accordance with applicable data protection laws.
            Your privacy is important to us.
          </p>

          <h2 className="text-3xl font-serif mb-8 mt-12">Contact</h2>
          <p className="text-slate-600">
            For legal inquiries, contact: legal@gias.institute
          </p>
        </div>
      </section>
    </div>
  )
}
