import { getSession } from "@/shared/lib/session/session";
import SettingsPageComponent from "@/features/settings/components/SettingsPageComponent";

export default async function SettingsPage() {
  const session = await getSession();

  return <SettingsPageComponent session={session} />;
}
