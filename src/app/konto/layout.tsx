import Link from "next/link";
import { requireCustomerSession } from "@/lib/customer-session";

export default async function CustomerLayout({ children }: { children: React.ReactNode }) {
  const customer = await requireCustomerSession();
  return <div className="account-shell"><header className="account-header"><Link href="/konto" className="account-brand"><span>W</span><strong>WEBLY / MOJE KONTO</strong></Link><nav><Link href="/konto">Witryny</Link><Link href="/konto/witryny/nowa">Nowa witryna</Link><Link href="/konto/sklep">Sprzedaż</Link><Link href="/konto/subskrypcja">Abonament</Link><Link href="/">Strona Webly ↗</Link></nav><div className="account-user"><span>{customer.name}</span><form action="/api/auth/logout" method="post"><button>WYLOGUJ</button></form></div></header>{children}</div>;
}
