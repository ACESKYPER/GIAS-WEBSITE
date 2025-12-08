import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'

export default function CertificationPage() {
  const certifications = [
    {
      id: 'mif-core',
      title: 'MIF Core Certification',
      description: 'Validates model interoperability across platforms',
      duration: '6 months',
      cost: 'Contact sales',
      status: 'Available',
    },
    {
      id: 'dsp-enterprise',
      title: 'DSP Enterprise Package',
      description: 'Data governance and stewardship certification for enterprises',
      duration: '12 months',
      cost: 'Contact sales',
      status: 'Available',
    },
    {
      id: 'explainability',
      title: 'Explainability & Transparency',
      description: 'Certification for transparent and interpretable AI systems',
      duration: '3 months',
      cost: 'Contact sales',
      status: 'Coming Soon',
    },
  ]

  return (
    <>
      <Header />
      <main className="min-h-screen">
        <section className="bg-white border-b border-slate-200">
          <div className="container-max py-24">
            <h1 className="text-5xl font-serif mb-6">GIAS Certification Programs</h1>
            <p className="prose-text max-w-3xl">
              Earn industry-recognized certifications that validate your AI systems meet GIAS standards for safety, transparency, and governance.
            </p>
          </div>
        </section>

        <section className="container-max py-16">
          <h2 className="text-3xl font-serif mb-12">Available Certifications</h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {certifications.map((cert) => (
              <div key={cert.id} className="card-panel border rounded-lg p-6 hover:shadow-lg transition">
                <h3 className="text-2xl font-serif mb-3">{cert.title}</h3>
                <p className="text-slate-600 mb-4">{cert.description}</p>
                <div className="space-y-2 text-sm mb-6">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Duration:</span>
                    <span className="font-medium">{cert.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Cost:</span>
                    <span className="font-medium">{cert.cost}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span
                    className={`px-3 py-1 rounded text-sm font-medium ${
                      cert.status === 'Available'
                        ? 'bg-green-100 text-green-800'
                        : cert.status === 'Coming Soon'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {cert.status}
                  </span>
                  {cert.status === 'Available' && (
                    <a href="#apply" className="text-blue-700 hover:text-blue-800 font-medium">
                      Apply →
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-neutral-50 py-16">
          <div className="container-max">
            <h2 className="text-3xl font-serif mb-8">Certification Process</h2>
            <div className="grid gap-8 md:grid-cols-3">
              <div>
                <div className="text-4xl font-bold text-blue-700 mb-3">1</div>
                <h3 className="text-xl font-serif mb-2">Application</h3>
                <p className="text-slate-600">Submit your AI system for review and initial assessment.</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-blue-700 mb-3">2</div>
                <h3 className="text-xl font-serif mb-2">Evaluation</h3>
                <p className="text-slate-600">Our team audits your system against GIAS standards.</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-blue-700 mb-3">3</div>
                <h3 className="text-xl font-serif mb-2">Certification</h3>
                <p className="text-slate-600">Receive your certificate and public listing.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="apply" className="container-max py-16">
          <div className="bg-slate-900 text-white rounded-lg p-12 text-center">
            <h2 className="text-3xl font-serif mb-4">Ready to Get Certified?</h2>
            <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
              Join leading organizations that have certified their AI systems with GIAS.
            </p>
            <a href="https://portal.gias.institute" className="inline-block px-8 py-3 bg-white text-slate-900 font-medium rounded hover:bg-slate-100 transition">
              Apply Now
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
