import { AlertTriangle } from "lucide-react";
import PolicyPageLayout from "./PolicyPageLayout";

export default function Disclaimer() {
  return (
    <PolicyPageLayout icon={AlertTriangle} title="Disclaimer">
      <p>
        The information provided by MessMaster Pro on our web application is for general informational and mess
        management purposes only. All information on the platform is provided in good faith.
      </p>

      <h2 className="text-lg font-bold text-gray-900 dark:text-white pt-2">1. Dietary & Allergy Disclaimer</h2>
      <p>
        While we offer Pure Veg and Mixed meal options, meals are prepared in a shared kitchen facility. Members with
        severe food allergies (such as nuts, dairy, or gluten) should consult mess staff before consuming meals.
        MessMaster Pro cannot guarantee complete absence of trace allergens.
      </p>

      <h2 className="text-lg font-bold text-gray-900 dark:text-white pt-2">2. Menu Variations</h2>
      <p>
        Daily menus displayed on the application are subject to seasonal ingredient availability. Mess management
        reserves the right to substitute menu items of equivalent nutritional value when necessary.
      </p>

      <h2 className="text-lg font-bold text-gray-900 dark:text-white pt-2">3. Service Availability</h2>
      <p>
        We strive to ensure continuous system and meal service availability. However, MessMaster Pro is not liable for
        temporary service interruptions caused by natural disasters, power outages, or technical maintenance.
      </p>
    </PolicyPageLayout>
  );
}
