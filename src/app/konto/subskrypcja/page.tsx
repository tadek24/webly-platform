import { SubscriptionManager } from "@/components/subscription-manager";
import { getSubscription } from "@/lib/customer-data";
import { requireCustomerSession } from "@/lib/customer-session";

export default async function SubscriptionPage() {
  const customer = await requireCustomerSession();
  const subscription = await getSubscription(customer.id);
  return <main className="account-main"><section className="account-page-title"><span>ABONAMENT</span><h1>Prosto, miesięcznie,<br /><em>bez technicznego chaosu.</em></h1><p>Zmiana planu zostanie zapisana od razu. Automatyczne płatności podłączymy do WooCommerce w następnym etapie.</p></section><SubscriptionManager initial={subscription} /></main>;
}

