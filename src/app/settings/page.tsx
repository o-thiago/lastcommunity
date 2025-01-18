import { api } from "@/lib/utils";
import { SettingsForm } from "./form";

export default async function Settings() {
  const { data } = await api.user.settings.get();
  const { data: loggedUser } = await api.auth.logged_user.get();

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-full max-w-md m-2 border rounded-lg">
        <div className="flex w-full h-12 bg-primary border-b rounded-t-lg items-center">
          <h2 className="ml-4 font-bold text-primary-foreground">
            Change your settings
          </h2>
        </div>
        <SettingsForm previousValues={data} loggedUser={loggedUser} />
      </div>
    </div>
  );
}
