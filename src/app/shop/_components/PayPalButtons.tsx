// Classic PayPal "Website Payments Standard" buttons -- no API keys, just
// the business PayPal email. Each button is a plain form POST to PayPal's
// hosted checkout, so this works with zero backend/JS payment logic.
//
// Requires NEXT_PUBLIC_PAYPAL_BUSINESS_EMAIL to be set (see
// .env.local.example). Until it is, the buttons render disabled so a
// missing env var fails loudly instead of quietly posting to nobody.

const PAYPAL_ACTION = "https://www.paypal.com/cgi-bin/webscr";

function HiddenFields({
  itemName,
  price,
  productId,
}: {
  itemName: string;
  price: number;
  productId: string;
}) {
  const businessEmail = process.env.NEXT_PUBLIC_PAYPAL_BUSINESS_EMAIL;
  return (
    <>
      <input type="hidden" name="business" value={businessEmail} />
      <input type="hidden" name="item_name" value={itemName} />
      <input type="hidden" name="item_number" value={productId} />
      <input type="hidden" name="amount" value={price.toFixed(2)} />
      <input type="hidden" name="currency_code" value="USD" />
      <input type="hidden" name="no_shipping" value="0" />
      <input type="hidden" name="shopping_url" value="https://chiefscustomcalls.com/shop" />
    </>
  );
}

export default function PayPalButtons({
  productId,
  name,
  price,
}: {
  productId: string;
  name: string;
  price: number;
}) {
  const businessEmail = process.env.NEXT_PUBLIC_PAYPAL_BUSINESS_EMAIL;

  if (!businessEmail) {
    return (
      <p className="shop-note">
        PayPal checkout isn&rsquo;t configured yet (missing
        NEXT_PUBLIC_PAYPAL_BUSINESS_EMAIL).
      </p>
    );
  }

  return (
    <div className="paypal-buttons">
      <form action={PAYPAL_ACTION} method="post" target="_blank">
        <input type="hidden" name="cmd" value="_cart" />
        <input type="hidden" name="add" value="1" />
        <HiddenFields itemName={name} price={price} productId={productId} />
        <button type="submit" className="btn btn-outline-dark">
          Add to Cart
        </button>
      </form>
      <form action={PAYPAL_ACTION} method="post" target="_blank">
        <input type="hidden" name="cmd" value="_xclick" />
        <HiddenFields itemName={name} price={price} productId={productId} />
        <button type="submit" className="btn btn-primary">
          Buy Now
        </button>
      </form>
    </div>
  );
}

export function ViewCartLink() {
  const businessEmail = process.env.NEXT_PUBLIC_PAYPAL_BUSINESS_EMAIL;
  if (!businessEmail) return null;
  const url = `${PAYPAL_ACTION}?cmd=_cart&business=${encodeURIComponent(businessEmail)}&display=1`;
  return (
    <a href={url} target="_blank" rel="noopener noreferrer">
      View Cart
    </a>
  );
}
