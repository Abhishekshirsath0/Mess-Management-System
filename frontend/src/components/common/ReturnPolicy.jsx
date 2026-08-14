import { RotateCcw } from "lucide-react";
import PolicyPageLayout from "./PolicyPageLayout";

export default function ReturnPolicy() {
  return (
    <PolicyPageLayout icon={RotateCcw} title="Return Policy">
      <p>
        Thank you for subscribing to MessMaster Pro meal services. Because our service involves freshly prepared,
        perishable food items and daily meal preparation, standard physical product return policies do not apply.
      </p>

      <h2 className="text-lg font-bold text-gray-900 dark:text-white pt-2">1. Food Item Return Eligibility</h2>
      <p>
        Perishable food items (lunch, dinner, or extra tiffin meals) delivered or served at the mess facility cannot be
        returned once prepared or consumed due to health and safety regulations.
      </p>

      <h2 className="text-lg font-bold text-gray-900 dark:text-white pt-2">2. Damaged or Quality Issues</h2>
      <p>
        If a tiffin container or meal served is compromised, spilled, or fails to meet quality standards upon delivery,
        please inform the mess administrator immediately within 2 hours of meal service time. Replacement meals or meal
        credits will be provided at the discretion of the mess manager.
      </p>

      <h2 className="text-lg font-bold text-gray-900 dark:text-white pt-2">3. Tiffin Container Return</h2>
      <p>
        Students subscribing to tiffin delivery options are issued reusable tiffin boxes. Issued tiffin boxes must be
        returned clean and undamaged upon plan termination. Security deposit deductions may apply for unreturned or
        broken tiffin containers.
      </p>

      <h2 className="text-lg font-bold text-gray-900 dark:text-white pt-2">4. Contact Support</h2>
      <p>
        For any return inquiries or meal condition reports, reach out to <b>support@messmasterpro.com</b> or visit the
        mess office.
      </p>
    </PolicyPageLayout>
  );
}
