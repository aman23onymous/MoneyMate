import React from "react";
import axios from "axios";
const Raztemp = () => {
    const amount= 1200;
  const paymentHandle = async() => {
    const {data:keyData}= await axios.get("http://localhost:8080/api/v1/payment/key");
    const {data:orderData}=await axios.post("http://localhost:8080/api/v1/payment/processPayment",{
        amount
    })
    const {key}=keyData;
    const {order}=orderData;
    console.log(`key : ${key}`);
    console.log(order);
      // Open Razorpay Checkout
      const options = {
        key, // Replace with your Razorpay key_id
        amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        currency: 'INR',
        name: 'Money Mate',
        description: 'Test Transaction',
        order_id: order.id, // This is the order_id created in the backend
        callback_url: 'http://localhost:8080/api/v1/payment/paymentVerification', // Your success URL
        prefill: {
          name: 'Gaurav Kumar',
          email: 'gaurav.kumar@example.com',
          contact: '9999999999'
        },
        theme: {
          color: '#F37254'
        },
      };

      const rzp = new Razorpay(options);
      rzp.open();
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <button
        onClick={paymentHandle}
        className="
          bg-gradient-to-r from-indigo-500 to-purple-600
          text-white
          px-6 py-3
          text-lg
          rounded-lg
          shadow-md
          hover:scale-105
          hover:shadow-xl
          transition
          duration-300
          ease-in-out
        "
      >
        Pay Now
      </button>
    </div>
  );
};

export default Raztemp;
