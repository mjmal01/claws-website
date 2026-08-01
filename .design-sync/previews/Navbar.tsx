import { Navbar } from '@/components/layout/Navbar'
import { NavProvider } from '../nav-provider'

// Owned preview — the generated version can't vary usePathname() per story
// (cfg.provider applies one fixed value to every preview uniformly; that's
// also why the config's Navbar override defaults to AboutActive as the
// single-card story). Wrapping each export in its own NavProvider here
// overrides the outer one (React context — innermost wins), giving each
// story its real active-link state.

export const Default = () => (
  <NavProvider pathname="/">
    <Navbar />
  </NavProvider>
)

export const AboutActive = () => (
  <NavProvider pathname="/about">
    <Navbar />
  </NavProvider>
)
