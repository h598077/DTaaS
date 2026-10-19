import * as React from 'react';
import Layout from 'page/Layout';
import TabComponent from 'components/tab/TabComponent';
import Iframe from 'components/Iframe';
import { TabData } from 'components/tab/subcomponents/TabRender';
import { useURLforDT } from 'util/envUtil';
import tabs from 'route/digitaltwins/DigitalTwinTabData';
import PageShell from 'components/PageShell';
import TabDescription from 'components/tab/TabDescription';
import { useState } from 'react';
import Button from '@mui/material/Button';
import {
  fetchRdtText,
  sendTextToJupyter,
  TestResponse,
  sendRdtTextToSpring,
} from './RulessDigitalTwin';

function DTContent() {
  const DTurl = useURLforDT();
  const [rdtData, setRdtData] = useState<TestResponse | null>(null);
  const [status, setStatus] = useState<string>('');

  const handleFetchFromApi = async () => {
    try {
      const data = await fetchRdtText();
      setRdtData(data);
      setStatus('Fetched RDT data.');
    } catch (_err: unknown) {
      setStatus(`Fetch failed: ${String('')}`);
    }
  };

  const handleSendToJupyter = async () => {
    if (!rdtData?.text) {
      setStatus('No data to send.');
      return;
    }

    try {
      await sendTextToJupyter(rdtData.text, 'output.txt');
      setStatus('Uploaded to Jupyter as output.txt.');
    } catch (_err: unknown) {
      setStatus(`Upload failed: ${String('')}`);
    }
  };

  const DTTab: TabData[] = tabs.map((tab) => ({
    label: tab.label,
    body: (
      <>
        <TabDescription>{tab.body}</TabDescription>

        {tab.label === 'RDT' && ( // Only show the fetch button and data for the RDT tab
          <>
            <div style={{ marginBottom: '1rem' }}>
              {status && <div style={{ marginTop: '0.5rem' }}>{status}</div>}
            </div>
            <Button
              onClick={handleFetchFromApi} // Fetch data from the API when clicked
            >
              Fetch RDT data
            </Button>
            <Button onClick={() => sendRdtTextToSpring()}>
              Send text to shared volume test
            </Button>
            {rdtData && (
              <>
                <Button
                  onClick={handleSendToJupyter} // Send the fetched data to Jupyter as a file
                  style={{ marginTop: '0.5rem' }}
                >
                  Send to Jupyter test without shared volume
                </Button>
              </>
            )}
          </>
        )}

        <Iframe title={`JupyterLight-Demo-${tab.label}`} url={DTurl} />
      </>
    ),
  }));

  return (
    <Layout>
      <PageShell
        title="Digital Twins"
        description="Create, run and analyse the digital twins in your workspace. "
      >
        <TabComponent assetType={DTTab} scope={[]} />
      </PageShell>
    </Layout>
  );
}

export default function DigitalTwins() {
  return <DTContent />;
}
