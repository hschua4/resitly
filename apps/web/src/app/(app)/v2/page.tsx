"use client";

import { DCArtboard, DCSection, DesignCanvas } from "./_components/canvas";
import {
  AppA,
  BulkB,
  CapA,
  DashA,
  DashB,
  DashC,
  DashD,
  DashE,
  ExpA,
  ExtA,
  RepA,
  SstA,
  VendA,
} from "./_components/screens";
import { TweaksPanel, useTweaks } from "./_components/tweaks";

const ART_W = 1280;
const ART_H = 760;

export default function V2Page() {
  const [tweaks, setTweaks] = useTweaks();
  const pins = tweaks.showAnnotations;
  const density = tweaks.density;

  return (
    <>
      <DesignCanvas
        title="Resitly · Wireframes"
        subtitle="Mid-fi exploration · v2 dashboard preview"
      >
        <DCSection
          title="① Dashboard"
          subtitle="What greets the SME owner each morning"
        >
          <DCArtboard label="A · Inbox" width={ART_W} height={ART_H}>
            <DashA pins={pins} density={density} />
          </DCArtboard>
          <DCArtboard label="B · Pipeline" width={ART_W} height={ART_H}>
            <DashB pins={pins} density={density} />
          </DCArtboard>
          <DCArtboard label="C · SST-front" width={ART_W} height={ART_H}>
            <DashC pins={pins} />
          </DCArtboard>
          <DCArtboard label="D · Calendar" width={ART_W} height={ART_H}>
            <DashD pins={pins} />
          </DCArtboard>
          <DCArtboard label="E · AI brief" width={ART_W} height={ART_H}>
            <DashE pins={pins} />
          </DCArtboard>
        </DCSection>

        <DCSection title="② Capture" subtitle="Getting receipts into the system">
          <DCArtboard label="A · Drop zone" width={ART_W} height={ART_H}>
            <CapA pins={pins} />
          </DCArtboard>
        </DCSection>

        <DCSection
          title="③ AI Extraction Review"
          subtitle="Confirming what the AI read off the receipt"
        >
          <DCArtboard label="A · Side-by-side" width={ART_W} height={ART_H}>
            <ExtA pins={pins} />
          </DCArtboard>
        </DCSection>

        <DCSection
          title="④ SST Categorization"
          subtitle="The Malaysian-specific differentiator"
        >
          <DCArtboard label="A · Rules table" width={ART_W} height={ART_H}>
            <SstA pins={pins} />
          </DCArtboard>
        </DCSection>

        <DCSection
          title="⑤ Bulk Processing"
          subtitle="When dozens of receipts arrive at once"
        >
          <DCArtboard label="B · Smart triage" width={ART_W} height={ART_H}>
            <BulkB pins={pins} />
          </DCArtboard>
        </DCSection>

        <DCSection title="⑥ Vendors" subtitle="Supplier management">
          <DCArtboard label="A · Vendor list" width={ART_W} height={ART_H}>
            <VendA pins={pins} />
          </DCArtboard>
        </DCSection>

        <DCSection title="⑦ Export" subtitle="To SQL Account, AutoCount, Xero…">
          <DCArtboard label="A · Connectors" width={ART_W} height={ART_H}>
            <ExpA pins={pins} />
          </DCArtboard>
        </DCSection>

        <DCSection
          title="⑧ Reports & SST Filing"
          subtitle="Period-end deliverables"
        >
          <DCArtboard label="A · SST-02 draft" width={ART_W} height={ART_H}>
            <RepA pins={pins} />
          </DCArtboard>
        </DCSection>

        <DCSection title="⑨ Approvals" subtitle="Multi-eyes sign-off">
          <DCArtboard label="A · Reviewer queue" width={ART_W} height={ART_H}>
            <AppA pins={pins} />
          </DCArtboard>
        </DCSection>
      </DesignCanvas>

      <TweaksPanel tweaks={tweaks} onChange={setTweaks} />
    </>
  );
}
