import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import { Layout } from './components/layout/layout';
import ThemeOverride from './theme/ThemeOverride';

function App(): React.JSX.Element {

  return (
    <>
      <MantineProvider theme={ThemeOverride}>
        <Layout />
      </MantineProvider>
    </>
  )
}

export default App
