import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../api/axios";
import AdminLayout from "../../components/AdminLayout";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stockQuantity: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    try {
      const { data } = await API.get(`/products/${id}`);

      setFormData({
        name: data.name,
        description: data.description,
        price: data.price,
        category: data.category,
        stockQuantity: data.stockQuantity,
      });

      setPreview(data.imageUrl);
    } catch (err) {
      console.error(err);
      alert("Failed to load product");
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const data = new FormData();

      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });

      if (image) {
        data.append("image", image);
      }

      await API.put(`/products/${id}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Product updated successfully.");

      navigate("/admin/products");

    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.message ||
        "Failed to update product"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <h1 className="text-4xl font-bold mb-8">
        Edit Product
      </h1>

      <form
        onSubmit={submitHandler}
        className="bg-white rounded-xl shadow p-8 max-w-3xl space-y-5"
      >
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border p-3 rounded"
          required
        />

        <textarea
          name="description"
          rows={5}
          value={formData.description}
          onChange={handleChange}
          className="w-full border p-3 rounded"
          required
        />

        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          className="w-full border p-3 rounded"
          required
        />

        <input
          type="text"
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full border p-3 rounded"
          required
        />

        <input
          type="number"
          name="stockQuantity"
          value={formData.stockQuantity}
          onChange={handleChange}
          className="w-full border p-3 rounded"
          required
        />

        {preview && (
          <img
            src={preview}
            alt="Product"
            className="w-40 h-40 object-cover rounded border"
          />
        )}

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          className="w-full border p-3 rounded"
        />

        <button
          disabled={loading}
          className="bg-black text-white px-8 py-3 rounded"
        >
          {loading ? "Updating..." : "Update Product"}
        </button>
      </form>
    </AdminLayout>
  );
};

export default EditProduct;