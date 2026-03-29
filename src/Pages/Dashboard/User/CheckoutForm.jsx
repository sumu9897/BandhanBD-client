import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAxiosPublic from "../../../hooks/useAxiosPublic";
import useAuth from "../../../hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { FaLock, FaShieldAlt, FaCheckCircle } from "react-icons/fa";
import { FaStripe } from "react-icons/fa6";

const PRICE_USD = 5;

const CheckoutForm = () => {
  const { biodataId: mongoId } = useParams();
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();
  const axiosSecure = useAxiosSecure();
  const axiosPublic = useAxiosPublic();
  const { user } = useAuth();

  const [clientSecret, setClientSecret] = useState("");
  const [cardError, setCardError] = useState("");
  const [processing, setProcessing] = useState(false);
  const [succeeded, setSucceeded] = useState(false);
  const [cardReady, setCardReady] = useState(false);

  const { data: biodata } = useQuery({
    queryKey: ["checkout-biodata", mongoId],
    enabled: !!mongoId,
    queryFn: async () => {
      const res = await axiosPublic.get(`/biodatas/${mongoId}`);
      return res.data;
    },
  });

  useEffect(() => {
    axiosSecure
      .post("/payment/create-intent")
      .then((res) => setClientSecret(res.data.clientSecret));
  }, [axiosSecure]);

  const handlePay = async () => {
    if (!stripe || !elements || !clientSecret) return;

    const card = elements.getElement(CardElement);
    if (!card) return;

    setProcessing(true);

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card,
        billing_details: {
          email: user?.email,
        },
      },
    });

    if (error) {
      setCardError(error.message);
      setProcessing(false);
      return;
    }

    if (paymentIntent.status === "succeeded") {
      setSucceeded(true);

      await axiosSecure.post("/payments", {
        email: user.email,
        amount: PRICE_USD,
        transactionId: paymentIntent.id,
        biodataId: biodata?.biodataId || mongoId,
      });

      Swal.fire("Success", "Payment Complete!", "success");
      navigate("/dashboard/contact-request");
    }

    setProcessing(false);
  };

  return (
    <div className="bg-[#fffcf6] border border-[#e6d5b8] rounded-2xl shadow-xl p-6">

      {/* Header */}
      <div className="mb-6">
        <p className="text-xs uppercase tracking-widest text-[#c07030] mb-2">
          Secure Payment
        </p>
        <h2 className="text-2xl font-bold text-[#18100a]">
          Checkout
        </h2>
        <p className="text-sm text-gray-500">
          One-time payment · No subscription
        </p>
      </div>

      {/* Profile */}
      <div className="flex justify-between items-center bg-[#f5ede0] p-4 rounded-lg border border-[#e6d5b8] mb-6">
        <div>
          <p className="text-xs uppercase text-gray-500">
            Unlocking contact info
          </p>
          <p className="font-medium text-[#18100a]">
            {biodata?.name || "Loading..."}
          </p>
        </div>

        <div className="text-right">
          <p className="text-2xl font-bold">$5</p>
          <span className="text-xs text-gray-500">USD</span>
        </div>
      </div>

      {/* Card */}
      <label className="text-xs uppercase text-gray-600">
        Card Details
      </label>

      <div className="border rounded-lg p-3 mt-2 bg-white focus-within:ring-2 focus-within:ring-[#d4833a]">
        <CardElement
          options={{
            hidePostalCode: true,
          }}
          onReady={() => setCardReady(true)}
          onChange={(e) => setCardError(e.error ? e.error.message : "")}
        />
      </div>

      {cardError && (
        <p className="text-red-500 text-sm mt-3">{cardError}</p>
      )}

      {!cardReady && (
        <p className="text-xs text-gray-400 mt-2">
          Loading secure card input...
        </p>
      )}

      {/* Button */}
      <button
        onClick={handlePay}
        disabled={!stripe || processing || succeeded}
        className="w-full mt-6 py-3 bg-[#18100a] text-white rounded-lg text-sm uppercase tracking-wide hover:bg-[#d4833a] transition disabled:opacity-50 flex justify-center items-center gap-2"
      >
        {succeeded ? (
          <>
            <FaCheckCircle /> Paid
          </>
        ) : processing ? (
          "Processing..."
        ) : (
          <>
            <FaLock /> Pay $5 Securely
          </>
        )}
      </button>

      {/* Trust */}
      <div className="flex justify-center gap-4 mt-4 text-xs text-gray-500 flex-wrap">
        <span className="flex items-center gap-1"><FaLock /> SSL</span>
        <span className="flex items-center gap-1"><FaShieldAlt /> Secure</span>
        <span className="flex items-center gap-1"><FaStripe /> Stripe</span>
      </div>

      {/* Hint */}
      <div className="mt-4 text-xs text-gray-500 border border-dashed p-3 rounded-lg">
        Use test card <strong>4242 4242 4242 4242</strong>
      </div>
    </div>
  );
};

export default CheckoutForm;