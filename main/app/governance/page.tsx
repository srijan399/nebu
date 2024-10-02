import Navbar from "@/components/functions/Navbar";

function FormCard() {
  return (
    <div className="bg-white p-5 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-800">Governance</h1>
      <p className="text-gray-600 mt-2">
        Fill the form below to apply for governance
      </p>
      <form className="mt-5">
        <div className="grid grid-cols-1 gap-6">
          <label className="block">
            <span className="text-gray-700">Full Name</span>
            <input
              type="text"
              className="form-input mt-1 block w-full"
              placeholder="John Doe"
            />
          </label>
          <label className="block">
            <span className="text-gray-700">Email</span>
            <input
              type="email"
              className="form-input mt-1 block w-full"
              placeholder="email"
            />
          </label>
          <label className="block">
            <span className="text-gray-700">Phone Number</span>
            <input
              type="tel"
              className="form-input mt-1 block w-full"
              placeholder="Phone Number"
            />
          </label>
          <label className="block">
            <span className="text-gray-700">Address</span>
            <input
              type="text"
              className="form-input mt-1 block w-full"
              placeholder="Address"
            />
          </label>
          <label className="block">
            <span className="text-gray-700">State</span>
            <input
              type="text"
              className="form-input mt-1 block w-full"
              placeholder="State"
            />
          </label>
          <label className="block">
            <span className="text-gray-700">Country</span>
            <input
              type="text"
              className="form-input mt-1 block w-full"
              placeholder="Country"
            />
          </label>
          <label className="block">
            <span className="text-gray-700">Zip Code</span>
            <input
              type="text"
              className="form-input mt-1 block w-full"
              placeholder="Zip Code"
            />
          </label>

          <div className="flex justify-between">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              Submit
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default function Gov() {
  return (
    <div>
      <Navbar />
      <div className="container mt-20 p-2">
        <FormCard />
      </div>
    </div>
  );
}
