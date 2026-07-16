import { useApp } from '../../shared/context/AppContext.jsx'
import Card from '../../shared/components/Card.jsx'
import Button from '../../shared/components/Button.jsx'
import PageHeader from '../components/PageHeader.jsx'

export default function Settings({ onLogout }) {
  const { resetDemoData } = useApp()

  return (
    <div>
      <PageHeader title="Settings" subtitle="Console preferences & demo controls." />

      <div className="grid max-w-2xl gap-4">
        <Card className="p-5">
          <h2 className="font-bold text-ink">Coordinator Account</h2>
          <p className="mt-1 text-sm text-ink-soft">coordinator@oveile.mm</p>
          <Button variant="secondary" className="mt-4" onClick={onLogout}>
            Sign Out
          </Button>
        </Card>

        <Card className="p-5">
          <h2 className="font-bold text-ink">Demo Data</h2>
          <p className="mt-1 text-sm text-ink-soft">
            Reset all consultations, manufacturers and buyers back to the seeded demo state.
          </p>
          <Button
            variant="danger"
            className="mt-4"
            onClick={() => {
              resetDemoData()
              alert('Demo data reset.')
            }}
          >
            Reset Demo Data
          </Button>
        </Card>
      </div>
    </div>
  )
}
