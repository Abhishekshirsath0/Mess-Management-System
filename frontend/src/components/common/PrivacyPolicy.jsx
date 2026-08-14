import { Shield } from "lucide-react";
import PolicyPageLayout from "./PolicyPageLayout";

export default function PrivacyPolicy() {
  return (
    <PolicyPageLayout icon={Shield} title="Privacy Policy">
      <p>
        At MessMaster Pro, accessible from our mess web application, one of our main priorities is the privacy of our
        visitors and members. This Privacy Policy document contains types of information that is collected and recorded
        by MessMaster Pro and how we use it.
      </p>

      <h2 className="text-lg font-bold text-gray-900 dark:text-white pt-2">1. Information We Collect</h2>
      <p>
        When you register for a MessMaster Pro account, we collect personal information including your full name,
        mobile number, parent phone number, email address, physical address, gender, dietary preferences (Pure Veg or
        Mixed), and selected subscription plan (BASIC, STANDARD, PREMIUM).
      </p>

      <h2 className="text-lg font-bold text-gray-900 dark:text-white pt-2">2. How We Use Your Information</h2>
      <ul className="list-disc pl-5 space-y-1">
        <li>To record, manage, and verify daily meal attendance (Lunch, Dinner, Extra Tiffins).</li>
        <li>To maintain accurate billing, payment statuses, and deposit records.</li>
        <li>To communicate important mess announcements and daily menu updates.</li>
        <li>To improve overall mess administration and prevent service disruptions.</li>
      </ul>

      <h2 className="text-lg font-bold text-gray-900 dark:text-white pt-2">3. Data Security & Storage</h2>
      <p>
        We implement strict security measures to maintain the safety of your personal information. Passwords are
        securely hashed using bcrypt encryption before storage. Access to personal data is restricted to authorized mess
        administrators.
      </p>

      <h2 className="text-lg font-bold text-gray-900 dark:text-white pt-2">4. Third-Party Sharing</h2>
      <p>
        We do not sell, trade, or transfer your personally identifiable information to outside third parties. Your data
        is strictly used for internal mess operations.
      </p>

      <h2 className="text-lg font-bold text-gray-900 dark:text-white pt-2">5. Contact Us</h2>
      <p>
        If you have additional questions or require more information about our Privacy Policy, do not hesitate to
        contact us at <b>support@messmasterpro.com</b>.
      </p>
    </PolicyPageLayout>
  );
}
