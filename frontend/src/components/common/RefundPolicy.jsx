import { DollarSign } from "lucide-react";
import PolicyPageLayout from "./PolicyPageLayout";

export default function RefundPolicy() {
  return (
    <PolicyPageLayout icon={DollarSign} title="Refund Policy">
      <p>
        At MessMaster Pro, we strive to maintain fair and transparent billing for all mess members. This Refund Policy
        outlines the terms for subscription refunds, meal cancellations, and deposit returns.
      </p>

      <h2 className="text-lg font-bold text-gray-900 dark:text-white pt-2">1. Monthly Subscription Refunds</h2>
      <p>
        Monthly plan payments (BASIC, STANDARD, PREMIUM) are billed in advance. If a student cancels their subscription
        within the first 3 days of the billing cycle without consuming meals, a full refund (minus a nominal processing
        fee) may be requested.
      </p>

      <h2 className="text-lg font-bold text-gray-900 dark:text-white pt-2">2. Pro-Rata Refunds & Leave Credits</h2>
      <p>
        Members taking planned leaves (such as vacations or academic breaks) must inform mess management at least 24
        hours prior. Unconsumed meals recorded during valid, pre-approved leaves will be adjusted as credits toward the
        next month's bill or refunded pro-rata.
      </p>

      <h2 className="text-lg font-bold text-gray-900 dark:text-white pt-2">3. Deposit Refunds</h2>
      <p>
        Initial mess security deposits paid during registration are fully refundable upon completion or formal
        termination of membership, provided all outstanding pending amounts are cleared and tiffin boxes are returned in
        good condition.
      </p>

      <h2 className="text-lg font-bold text-gray-900 dark:text-white pt-2">4. Processing Time</h2>
      <p>Approved refunds will be processed via original payment mode or bank transfer within 5 to 7 business days.</p>
    </PolicyPageLayout>
  );
}
