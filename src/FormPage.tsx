import React, { useState, ChangeEvent, FormEvent } from "react";

const API_URL = process.env.API_URL;

// Define an interface to represent the form data structure
interface FormData {
  noticeNumber: string;
  amount: number;
  description: string;
  expiryDate: string;
  payeeId: string;
  payerId: string;
}

const FormPage: React.FC = () => {
  // Set up state for form data
  const [formData, setFormData] = useState<FormData>({
    noticeNumber: "",
    amount: 0,
    description: "",
    expiryDate: "",
    payeeId: "",
    payerId: "",
  });

  // Set up state for the response message from the server
  const [responseMessage, setResponseMessage] = useState<string>("");

  // Handle changes in the form fields (input and textarea)
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "amount" ? parseInt(value) : value, // Parse amount as integer
    });
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    try {
      // Send form data to a specified endpoint
      const response = await fetch(`${API_URL}/rtps`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      // Handle response from the server
      if (response.ok) {
        setResponseMessage("Request to pay created successfully!");
      } else {
        setResponseMessage("Error creating the request to pay.");
      }
    } catch (error: any) {
      setResponseMessage("An error occurred: " + error.message);
    }
  };

  return (
    <div>
      <h2>Create a Request To Pay (RTP)</h2>
      {/* Form submission is handled by handleSubmit */}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="noticeNumber">Notice Number:</label>
          <input
            type="text"
            id="noticeNumber"
            name="noticeNumber"
            pattern="\d{18}"
            value={formData.noticeNumber}
            onChange={handleChange}
            // required
            placeholder="18-digit Notice Number"
          />
        </div>

        <div>
          <label htmlFor="amount">Amount (in euro cents):</label>
          <input
            type="number"
            id="amount"
            name="amount"
            min="0"
            max="99999999"
            value={formData.amount}
            onChange={handleChange}
            // required
            placeholder="Amount in cents"
          />
        </div>

        <div>
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            maxLength={140}
            value={formData.description}
            onChange={handleChange}
            // required
            placeholder="Enter a brief description (max 140 chars)"
          />
        </div>

        <div>
          <label htmlFor="expiryDate">Expiry Date:</label>
          <input
            type="date"
            id="expiryDate"
            name="expiryDate"
            value={formData.expiryDate}
            onChange={handleChange}
            // required
          />
        </div>

        <div>
          <label htmlFor="payeeId">Payee ID (Fiscal Code):</label>
          <input
            type="text"
            id="payeeId"
            name="payeeId"
            pattern="\d{11}"
            value={formData.payeeId}
            onChange={handleChange}
            // required
            placeholder="11-digit Fiscal Code"
          />
        </div>

        <div>
          <label htmlFor="payerId">Payer ID (Fiscal Code):</label>
          <input
            type="text"
            id="payerId"
            name="payerId"
            value={formData.payerId}
            onChange={handleChange}
            // required
            placeholder="Fiscal Code"
          />
        </div>

        <button type="submit">Submit Request</button>
      </form>

      {/* Display the response message */}
      {responseMessage && <p>{responseMessage}</p>}
    </div>
  );
};

export default FormPage;