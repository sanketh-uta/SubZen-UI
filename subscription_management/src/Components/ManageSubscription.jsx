import { useContext, useState, useEffect } from "react";
import { useUser } from "./UserContext";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { parse, format } from "date-fns";
import { BACKEND_URL } from "../config";

function ManageSubscription() {
  const { user } = useUser();
  // State for subscriptions data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [subscriptions, setSubscriptions] = useState([
    {
      id: 1,
      name: "Netflix",
      category: "Entertainment",
      plan: "Premium",
      price: 19.99,
      billingCycle: "month",
      nextBillingDate: "2025-04-15",
    },
    {
      id: 2,
      name: "Spotify",
      category: "Music",
      plan: "Individual",
      price: 9.99,
      billingCycle: "month",
      nextBillingDate: "2025-03-22",
    },
    {
      id: 3,
      name: "Adobe Creative Cloud",
      category: "Software",
      plan: "All Apps",
      price: 52.99,
      billingCycle: "month",
      nextBillingDate: "2025-04-03",
    },
  ]);
  useEffect(() => {
    fetchSubscriptions();
  }, []);
  const fetchSubscriptions = async () => {
    setLoading(true);
    try {
      const response = await axios.get(BACKEND_URL + "addSub", {
        withCredentials: true, // Important for sending cookies
      });
      console.log("API response:", response);
      setSubscriptions(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching subscriptions:", err);
      setError("Failed to load subscriptions. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  // State for modals
  const [editingSubscription, setEditingSubscription] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // State for layout type
  const [layoutStyle, setLayoutStyle] = useState("cards");

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    plan: "",
    price: "",
    billingCycle: "",
    nextBillingDate: "",
  });

  const [newSubscriptionData, setNewSubscriptionData] = useState({
    name: "",
    category: "Entertainment",
    plan: "",
    price: "",
    billingCycle: "month",
    nextBillingDate: "",
  });

  // Initialize edit form when a subscription is selected
  useEffect(() => {
    if (editingSubscription) {
      setFormData({
        name: editingSubscription.name || "",
        category: editingSubscription.category || "",
        plan: editingSubscription.plan || "",
        price: editingSubscription.price || "",
        billingCycle: editingSubscription.billingCycle || "month",
        nextBillingDate: editingSubscription.nextBillingDate
          ? editingSubscription.nextBillingDate.split("T")[0]
          : "",
      });
    }
  }, [editingSubscription]);

  // Form handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  // Add this sorting function in your component
  const sortSubscriptions = (field) => {
    const sortedData = [...subscriptions].sort((a, b) => {
      if (field === "nextBillingDate") {
        // Date comparison
        const dateA = new Date(a[field]);
        const dateB = new Date(b[field]);
        return dateA - dateB;
      } else if (field === "price") {
        // Numeric comparison
        return a[field] - b[field];
      } else {
        // String comparison (for name)
        const valueA = (a[field] || "").toLowerCase();
        const valueB = (b[field] || "").toLowerCase();
        return valueA.localeCompare(valueB);
      }
    });

    setSubscriptions(sortedData);
  };
  const handleNewSubscriptionChange = (e) => {
    const { name, value } = e.target;
    setNewSubscriptionData({
      ...newSubscriptionData,
      [name]: value,
    });
  };

  // Form submission handlers
  const handleSubmit = (e) => {
    e.preventDefault();

    // Log the current editing subscription to debug
    console.log("Editing subscription:", editingSubscription);
    console.log("Form data:", formData);

    if (!editingSubscription || !editingSubscription.sub_id) {
      console.error("Invalid editing subscription or missing ID");
      return;
    }

    // Create the postData directly from form data and the editing subscription ID
    const postData = {
      sub_id: editingSubscription.sub_id, // Use ID directly from editingSubscription
      name: formData.name,
      category: formData.category,
      plan: formData.plan,
      price: parseFloat(formData.price),
      billingCycle: formData.billingCycle,
      nextBillingDate: formData.nextBillingDate,
    };

    console.log("Data being sent to backend:", postData);

    axios
      .put(BACKEND_URL + "addSub/edit", JSON.stringify(postData), {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      })
      .then((response) => {
        console.log("Successfully updated:", response.data);

        // Update the state with the updated data
        const updatedSubscriptions = subscriptions.map((sub) =>
          sub.sub_id === editingSubscription.sub_id
            ? { ...sub, ...formData, price: parseFloat(formData.price) }
            : sub
        );
        setSubscriptions(updatedSubscriptions);
        setEditingSubscription(null);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleAddSubscription = (e) => {
    e.preventDefault();
    console.log(e.target.value);
    // Create a new subscription object
    const newSubscription = {
      id: subscriptions.length + 1,
      ...newSubscriptionData,
      price: parseFloat(newSubscriptionData.price),
    };
    const postData = {
      name: newSubscriptionData.name,
      category: newSubscriptionData.category,
      plan: newSubscriptionData.plan,
      price: newSubscriptionData.price,
      billingCycle: newSubscriptionData.billingCycle,
      nextBillingDate: newSubscriptionData.nextBillingDate,
    };
    console.log("Sending data:", postData);
    axios
      .post(BACKEND_URL + "addSub", JSON.stringify(postData), {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      })
      .then((data) => {
        console.log("Successfully created");
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    // Add it to the list
    setSubscriptions([...subscriptions, newSubscription]);

    // Close the modal and reset form
    setIsAddModalOpen(false);
    setNewSubscriptionData({
      name: "",
      category: "Entertainment",
      plan: "",
      price: "",
      billingCycle: "month",
      nextBillingDate: "",
    });
  };

  // Delete subscription
  const handleDelete = (subscriptionId) => {
    console.log("deleting id " + subscriptionId);
    if (confirm("Are you sure you want to delete this subscription?")) {
      axios
        .delete(BACKEND_URL + "addSub/delete", {
          data: { id: subscriptionId }, // This puts the ID in the request body
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        })
        .then((response) => {
          console.log("Successfully deleted:", response.data);
          // Update UI after successful deletion
        })
        .catch((error) => {
          console.error("Error deleting subscription:", error);
        });
      const updatedSubscriptions = subscriptions.filter(
        (sub) => sub.sub_id !== subscriptionId
      );
      setSubscriptions(updatedSubscriptions);
    }
  };

  return (
    <div className="bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 min-h-screen py-6">
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        <h1 className="text-2xl md:text-3xl font-bold text-purple-900 mb-6">
          <div className="mb-8">
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-600">
              <div className="flex items-center space-x-4">
                {user.photoURL ? (
                    <>
                {console.log("Photo URL:", user.photoURL)}
                  <img
                    src={user.photoURL}
                    alt={user.displayName}
                    className="h-12 w-12 rounded-full"
                  />
                  </>
                ) : (
                  <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-lg">
                    {user.displayName.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                    Welcome back,{" "}
                    <span className="text-purple-700">{user.displayName}</span>
                  </h1>
                  <p className="text-gray-600">
                    Manage your subscriptions and stay on top of your finances
                  </p>
                </div>
              </div>
            </div>
          </div>
        </h1>

        {/* Layout toggle and Add button */}
        <div className="flex flex-wrap justify-between items-center mb-6">
          <div className="flex space-x-2 mb-4 md:mb-0">
            <button
              onClick={() => setLayoutStyle("cards")}
              className={`px-3 py-1 rounded text-sm ${
                layoutStyle === "cards"
                  ? "bg-purple-600 text-white"
                  : "border border-purple-600 text-purple-800"
              }`}
            >
              Card View
            </button>
            <button
              onClick={() => setLayoutStyle("list")}
              className={`px-3 py-1 rounded text-sm ${
                layoutStyle === "list"
                  ? "bg-purple-600 text-white"
                  : "border border-purple-600 text-purple-800"
              }`}
            >
              List View
            </button>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded flex items-center"
          >
            <svg
              className="w-5 h-5 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Subscription
          </button>
        </div>

        {/* Subscription Summary */}
        <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-6">
          <div className="flex flex-wrap items-center justify-between">
            <div className="mb-4 md:mb-0">
              <span className="text-sm text-purple-800">
                {subscriptions.length} Active Subscriptions
              </span>
              <h2 className="text-xl font-semibold">
                $
                {Array.isArray(subscriptions)
                  ? subscriptions
                      .reduce((total, sub) => total + (sub.price || 0), 0)
                      .toFixed(2)
                  : "0.00"}{" "}
                monthly total
              </h2>
            </div>
            <div className="flex space-x-2">
              <select
                className="border rounded-md px-3 py-2 text-sm"
                onChange={(e) => sortSubscriptions(e.target.value)}
              >
                <option value="">Sort by...</option>
                <option value="name">Sort by Name</option>
                <option value="price">Sort by Price</option>
                <option value="nextBillingDate">Sort by Next Billing</option>
              </select>
            </div>
          </div>
        </div>

        {/* Subscriptions Display */}
        {layoutStyle === "cards" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subscriptions.map((subscription) => (
              <div
                key={subscription.id}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <div className="p-4 border-b">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-lg">
                      {subscription.name}
                    </h3>
                    <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                      {subscription.category || "Uncategorized"}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Plan</span>
                    <span>{subscription.plan || "Standard"}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Price</span>
                    <span className="font-semibold">
                      ${subscription.price?.toFixed(2) || "0.00"}/
                      {subscription.billingCycle || "month"}
                    </span>
                  </div>
                  <div className="flex justify-between mb-4">
                    <span className="text-gray-600">Next billing</span>
                    <span className="text-purple-800">
                      {subscription.nextBillingDate
                        ? new Date(
                            `${subscription.nextBillingDate}T00:00:00`
                          ).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </div>
                  <div className="flex space-x-2 mt-4">
                    <button
                      onClick={() => setEditingSubscription(subscription)}
                      className="bg-purple-600 text-white px-3 py-1 rounded text-sm flex-1 hover:bg-purple-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(subscription.sub_id)}
                      className="border border-red-500 text-red-500 px-3 py-1 rounded text-sm flex-1 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Desktop view - full table */}
            <div className="hidden md:block">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Service
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Plan
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Next Billing
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {subscriptions.map((subscription) => (
                    <tr key={subscription.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {subscription.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {subscription.category}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {subscription.plan || "Standard"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          ${subscription.price?.toFixed(2) || "0.00"}
                        </div>
                        <div className="text-sm text-gray-500">
                          per {subscription.billingCycle || "month"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-800">
                        {subscription.nextBillingDate
                          ? format(
                              parse(
                                subscription.nextBillingDate,
                                "yyyy-MM-dd",
                                new Date()
                              ),
                              "MM/dd/yyyy"
                            )
                          : "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => setEditingSubscription(subscription)}
                          className="text-purple-600 hover:text-purple-900 mr-3"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(subscription.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile view - stacked cards that look like list items */}
            <div className="block md:hidden">
              <div className="divide-y divide-gray-200">
                {subscriptions.map((subscription) => (
                  <div key={subscription.id} className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-medium text-gray-900">
                          {subscription.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {subscription.category}
                        </div>
                      </div>
                      <div className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                        {subscription.plan || "Standard"}
                      </div>
                    </div>

                    <div className="mt-2 grid grid-cols-2 gap-y-1">
                      <div className="text-sm text-gray-500">Price:</div>
                      <div className="text-sm text-right">
                        ${subscription.price?.toFixed(2) || "0.00"}
                        <span className="text-xs text-gray-500">
                          per {subscription.billingCycle || "month"}
                        </span>
                      </div>

                      <div className="text-sm text-gray-500">Next billing:</div>
                      <div className="text-sm text-purple-800 text-right">
                        {subscription.nextBillingDate
                          ? format(
                              parse(
                                subscription.nextBillingDate,
                                "yyyy-MM-dd",
                                new Date()
                              ),
                              "MM/dd/yyyy"
                            )
                          : "N/A"}
                      </div>
                    </div>

                    <div className="mt-3 flex justify-end space-x-3">
                      <button
                        onClick={() => setEditingSubscription(subscription)}
                        className="text-sm text-purple-600 hover:text-purple-900"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(subscription.id)}
                        className="text-sm text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {editingSubscription && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-purple-900">
                    Edit {editingSubscription.name}
                  </h2>
                  <button
                    onClick={() => setEditingSubscription(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        className="block text-gray-700 mb-2"
                        htmlFor="name"
                      >
                        Service Name *
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        className="w-full p-2 border rounded-md"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div>
                      <label
                        className="block text-gray-700 mb-2"
                        htmlFor="plan"
                      >
                        Plan Type
                      </label>
                      <input
                        id="plan"
                        name="plan"
                        type="text"
                        className="w-full p-2 border rounded-md"
                        value={formData.plan}
                        onChange={handleChange}
                      />
                    </div>

                    <div>
                      <label
                        className="block text-gray-700 mb-2"
                        htmlFor="price"
                      >
                        Price *
                      </label>
                      <input
                        id="price"
                        name="price"
                        type="number"
                        step="0.01"
                        className="w-full p-2 border rounded-md"
                        value={formData.price}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div>
                      <label
                        className="block text-gray-700 mb-2"
                        htmlFor="billingCycle"
                      >
                        Billing Frequency *
                      </label>
                      <select
                        id="billingCycle"
                        name="billingCycle"
                        className="w-full p-2 border rounded-md"
                        value={formData.billingCycle}
                        onChange={handleChange}
                        required
                      >
                        <option value="month">Monthly</option>
                        <option value="quarter">Quarterly</option>
                        <option value="year">Annually</option>
                        <option value="custom">Custom</option>
                      </select>
                    </div>

                    <div>
                      <label
                        className="block text-gray-700 mb-2"
                        htmlFor="category"
                      >
                        Category
                      </label>
                      <select
                        id="category"
                        name="category"
                        className="w-full p-2 border rounded-md"
                        value={formData.category}
                        onChange={handleChange}
                      >
                        <option value="Entertainment">Entertainment</option>
                        <option value="Software">Software</option>
                        <option value="Music">Music</option>
                        <option value="News">News</option>
                        <option value="Shopping">Shopping</option>
                        <option value="Gaming">Gaming</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label
                        className="block text-gray-700 mb-2"
                        htmlFor="nextBillingDate"
                      >
                        Next Billing Date *
                      </label>
                      <input
                        id="nextBillingDate"
                        name="nextBillingDate"
                        type="date"
                        className="w-full p-2 border rounded-md"
                        value={formData.nextBillingDate}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4 mt-6">
                    <button
                      type="button"
                      className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                      onClick={() => setEditingSubscription(null)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Add Subscription Modal */}
        {isAddModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-purple-900">
                    Add New Subscription
                  </h2>
                  <button
                    onClick={() => setIsAddModalOpen(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <form onSubmit={handleAddSubscription}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        className="block text-gray-700 mb-2"
                        htmlFor="new-name"
                      >
                        Service Name *
                      </label>
                      <input
                        id="new-name"
                        name="name"
                        type="text"
                        className="w-full p-2 border rounded-md"
                        value={newSubscriptionData.name}
                        onChange={handleNewSubscriptionChange}
                        required
                      />
                    </div>

                    <div>
                      <label
                        className="block text-gray-700 mb-2"
                        htmlFor="new-plan"
                      >
                        Plan Type
                      </label>
                      <input
                        id="new-plan"
                        name="plan"
                        type="text"
                        className="w-full p-2 border rounded-md"
                        value={newSubscriptionData.plan}
                        onChange={handleNewSubscriptionChange}
                      />
                    </div>

                    <div>
                      <label
                        className="block text-gray-700 mb-2"
                        htmlFor="new-price"
                      >
                        Price *
                      </label>
                      <input
                        id="new-price"
                        name="price"
                        type="number"
                        step="0.01"
                        className="w-full p-2 border rounded-md"
                        value={newSubscriptionData.price}
                        onChange={handleNewSubscriptionChange}
                        required
                      />
                    </div>

                    <div>
                      <label
                        className="block text-gray-700 mb-2"
                        htmlFor="new-billingCycle"
                      >
                        Billing Frequency *
                      </label>
                      <select
                        id="new-billingCycle"
                        name="billingCycle"
                        className="w-full p-2 border rounded-md"
                        value={newSubscriptionData.billingCycle}
                        onChange={handleNewSubscriptionChange}
                        required
                      >
                        <option value="month">Monthly</option>
                        <option value="quarter">Quarterly</option>
                        <option value="year">Annually</option>
                        <option value="custom">Custom</option>
                      </select>
                    </div>

                    <div>
                      <label
                        className="block text-gray-700 mb-2"
                        htmlFor="new-category"
                      >
                        Category
                      </label>
                      <select
                        id="new-category"
                        name="category"
                        className="w-full p-2 border rounded-md"
                        value={newSubscriptionData.category}
                        onChange={handleNewSubscriptionChange}
                      >
                        <option value="Entertainment">Entertainment</option>
                        <option value="Software">Software</option>
                        <option value="Music">Music</option>
                        <option value="News">News</option>
                        <option value="Shopping">Shopping</option>
                        <option value="Gaming">Gaming</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label
                        className="block text-gray-700 mb-2"
                        htmlFor="new-nextBillingDate"
                      >
                        Next Billing Date *
                      </label>
                      <input
                        id="new-nextBillingDate"
                        name="nextBillingDate"
                        type="date"
                        className="w-full p-2 border rounded-md"
                        value={newSubscriptionData.nextBillingDate}
                        onChange={handleNewSubscriptionChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4 mt-6">
                    <button
                      type="button"
                      className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                      onClick={() => setIsAddModalOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                      Add Subscription
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ManageSubscription;
