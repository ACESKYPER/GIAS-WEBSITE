export default function GovernancePage(){
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-serif text-slate-900">Governance</h1>
      <p className="text-sm text-slate-600 mt-2">Council members, minutes, policies and conflict-of-interest disclosures.</p>

      <div className="mt-6 bg-white border rounded p-6">
        <h2 className="font-medium">GIAS Council</h2>
        <ul className="mt-3 text-sm text-slate-700">
          <li>Dr. Amara Okonkwo — Chair</li>
          <li>Prof. Elias Marten — Member</li>
        </ul>
      </div>
    </div>
  )
}
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function GovernancePage() {
  const councilMembers = [
    { name: 'Dr. Sarah Chen', role: 'Chair', affiliation: 'AI Research Consortium' },
    { name: 'James Mitchell', role: 'Vice Chair', affiliation: 'Enterprise Standards Board' },
    { name: 'Dr. Amara Okonkwo', role: 'Standards Lead', affiliation: 'Global Tech Council' },
    { name: 'Robert Thorne', role: 'Audit Lead', affiliation: 'Independent Auditor' },
    { name: 'Elena Voss', role: 'Member', affiliation: 'Government Regulatory Authority' },
    { name: 'Vikram Patel', role: 'Member', affiliation: 'Academic Consortium' },
  ]

  return (
    <>
      <Header />
      <main>
        <section className="bg-white border-b border-slate-200">
          <div className="container-max py-16">
            <h1 className="text-5xl mb-4">Governance</h1>
            <p className="prose-text">
              GIAS is governed by an independent council of standards experts, auditors, and stakeholder representatives.
            </p>
          </div>
        </section>

        <section className="container-max py-16">
          <h2 className="text-3xl mb-8">Council Members</h2>
          <div className="grid grid-cols-2 gap-8 mb-16">
            {councilMembers.map((member, i) => (
              <div key={i} className="card-panel">
                <h3 className="text-xl font-serif mb-2">{member.name}</h3>
                <p className="text-sm font-medium text-blue-700 mb-1">{member.role}</p>
                <p className="text-sm text-slate-600">{member.affiliation}</p>
              </div>
            ))}
          </div>

          <div className="card-panel mb-8">
            <h3 className="text-2xl font-serif mb-4">Conflict of Interest Policy</h3>
            <p className="text-slate-600 mb-4">
              All council members agree to maintain the highest standards of integrity and disclose any potential conflicts of interest. Read our comprehensive COI policy:
            </p>
            <a href="/legal/coi" className="text-blue-700 hover:text-blue-800 font-medium">
              Full COI Policy →
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
