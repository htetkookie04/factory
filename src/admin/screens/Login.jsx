import { useState } from 'react'
import Button from '../../shared/components/Button.jsx'
import { Field, TextInput } from '../../shared/components/Field.jsx'
import { Icon } from '../../user/components/Icon.jsx'

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('coordinator@oveile.mm')
  const [password, setPassword] = useState('demo')

  return (
    <div className="grid min-h-screen place-items-center bg-gradient-to-br from-primary to-[#3d2a1c] px-4">
      <div className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-card">
        <div className="mb-6 flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-primary text-white">
            <Icon name="shirt" className="h-6 w-6" />
          </span>
          <div>
            <p className="text-lg font-bold text-ink">OVEILE Console</p>
            <p className="text-xs text-ink-soft">Coordinator sign-in</p>
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            onLogin()
          }}
          className="space-y-4"
        >
          <Field label="Email">
            <TextInput value={email} onChange={(e) => setEmail(e.target.value)} />
          </Field>
          <Field label="Password">
            <TextInput
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Field>
          <Button full size="lg" type="submit">
            Sign In
          </Button>
        </form>
        <p className="mt-4 text-center text-xs text-ink-soft">
          Demo console — any credentials work.
        </p>
      </div>
    </div>
  )
}
