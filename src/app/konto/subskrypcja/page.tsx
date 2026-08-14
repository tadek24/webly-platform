import { SubscriptionManager } from "@/components/subscription-manager";
import { getPackages, getSubscription } from "@/lib/customer-data";
import { requireCustomerSession } from "@/lib/customer-session";
import { DEFAULT_PACKAGES } from "@/lib/package-defaults";

export default async function SubscriptionPage() {
  const customer = await requireCustomerSession();
  const [subscription, packages] = await Promise.all([getSubscription(customer.id), getPackages().catch(() => DEFAULT_PACKAGES)]);
  return <main className="account-main"><section className="account-page-title"><span>ABONAMENT</span><h1>Prosto, miesięcznie,<br /><em>bez technicznego chaosu.</em></h1><p>Wybierasz zakres usługi, a Webly zajmuje się hostingiem, aktualizacjami i zapleczem. Niczego nie instalujesz.</p></section><SubscriptionManager initial={subscription} packages={packages} /></main>;
}
