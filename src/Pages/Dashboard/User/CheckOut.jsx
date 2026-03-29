import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { Link, useParams } from "react-router-dom";
import CheckoutForm from "./CheckoutForm";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const elementsOptions = {
  fonts: [
    {
      cssSrc:
        "https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400&display=swap",
    },
  ],
};

const CheckOut = () => {
  const { biodataId } = useParams();

  return (
    <div className="min-h-screen bg-[#f7f2ea] px-6 py-8 pb-20 font-sans">
      <div className="mx-auto max-w-[520px]">
        <Link
          to={`/biodata/${biodataId}`}
          className="mb-8 inline-flex items-center gap-2 rounded-md border border-[rgba(196,168,128,0.28)] bg-[#fffcf6] px-4 py-2 text-[11px] font-medium uppercase tracking-[0.1em] text-[#9a8270] transition hover:border-[#d4833a] hover:text-[#c07030]"
        >
          ← Back to Profile
        </Link>

        <Elements stripe={stripePromise} options={elementsOptions}>
          <CheckoutForm />
        </Elements>
      </div>
    </div>
  );
};

export default CheckOut;