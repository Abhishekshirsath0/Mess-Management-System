import { RotateCcw } from "lucide-react";
import PolicyPageLayout from "./PolicyPageLayout";

export default function ReturnPolicy() {
  return (
    <PolicyPageLayout icon={RotateCcw} title="Return Policy">
      <p>
        Thank you for using MessMaster Pro. Since we provide freshly prepared
        and perishable food, food items cannot be returned after they have been
        prepared or served.
      </p>

      <h2 className="text-lg font-bold text-gray-900 dark:text-white pt-2">
        1. Food Return Policy
      </h2>
      <p>
        Lunch, dinner, and extra tiffin meals cannot be returned once they are
        prepared or served. This is because the food is fresh and perishable.
      </p>

      <h2 className="text-lg font-bold text-gray-900 dark:text-white pt-2">
        2. Damaged or Poor-Quality Food
      </h2>
      <p>
        If your meal is damaged, spilled, or has a quality issue, please inform
        the mess administrator within 2 hours of receiving the meal. Depending
        on the situation, we may provide a replacement meal or meal credit.
      </p>

      <h2 className="text-lg font-bold text-gray-900 dark:text-white pt-2">
        3. Tiffin Box Return
      </h2>
      <p>
        If you use our tiffin delivery service, you will receive a reusable
        tiffin box. The tiffin box must be returned in good condition when your
        subscription ends. A security deposit may be deducted if the box is
        lost or damaged.
      </p>

      <h2 className="text-lg font-bold text-gray-900 dark:text-white pt-2">
        4. Contact Us
      </h2>
      <p>
        If you have any questions or problems with your meal or tiffin box,
        please contact us at <b>support@messmasterpro.com</b> or visit the
        mess office.
      </p>
    </PolicyPageLayout>
  );
}