import Link from "next/link";
import "./shop.css";

export default function ShopLayout({ children }: LayoutProps<"/shop">) {
  return (
    <>
      <header className="shop-header">
        <div className="wrap">
          <Link href="/" className="shop-wordmark">
            Chief&rsquo;s Custom Calls
          </Link>
          <nav>
            <Link href="/">Home</Link>
            <Link href="/shop">Shop</Link>
            <Link href="/#custom">Custom Order</Link>
            <Link href="/#contact">Contact</Link>
          </nav>
        </div>
      </header>

      {children}

      <footer className="shop-footer">
        <p>
          &copy; {new Date().getFullYear()} Chief&rsquo;s Custom Calls &middot;
          Veteran owned, built in Georgia, USA &middot; Checkout is handled
          securely on our{" "}
          <a
            href="https://www.chiefscustomcalls.com/shop"
            target="_blank"
            rel="noopener noreferrer"
          >
            store
          </a>
        </p>
      </footer>
    </>
  );
}
