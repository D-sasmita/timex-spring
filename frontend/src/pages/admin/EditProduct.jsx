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
  }, [id]);

  const fetchProduct = async () => {
    try {
      const { data } = await API.get(`/products/${id}`);

      setFormData({
        name: data.name || "",
        description: data.description || "",
        price: data.price || "",
        category: data.category || "",
        stockQuantity: data.stockQuantity || "",
      });

      setPreview(data.imageUrl ? `${process.env.REACT_APP_API_BASE_URL}/images/${data.imageUrl}` : "");

    } catch (err) {
      console.error("Fetch product error:", err);

      if (err.response?.status === 403) {
        alert("You are not authorized to edit products.");
        navigate("/admin/products");
      } else {
        alert("Failed to load product");
      }
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];

    if (!selectedImage) return;

    setImage(selectedImage);

    // Show new image immediately
    setPreview(URL.createObjectURL(selectedImage));
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const data = new FormData();

      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("price", formData.price);
      data.append("category", formData.category);
      data.append("stockQuantity", formData.stockQuantity);

      if (image) {
        data.append("image", image);
      }

      await API.put(`/products/${id}`, data);

      alert("Product updated successfully.");

      navigate("/admin/products");

    } catch (err) {
      console.error("Update product error:", err);

      if (err.response?.status === 403) {
        alert("You are not authorized to update products.");
      } else {
        alert(
          err.response?.data?.message ||
          "Failed to update product"
        );
      }

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
          placeholder="Product Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border p-3 rounded"
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          rows={5}
          value={formData.description}
          onChange={handleChange}
          className="w-full border p-3 rounded"
          required
        />

        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          min="0"
          step="0.01"
          className="w-full border p-3 rounded"
          required
        />

        <input
          type="text"
          name="category"
          placeholder="Category"
          value={formData.category}
          onChange={handleChange}
          className="w-full border p-3 rounded"
          required
        />

        <input
          type="number"
          name="stockQuantity"
          placeholder="Stock Quantity"
          value={formData.stockQuantity}
          onChange={handleChange}
          min="0"
          className="w-full border p-3 rounded"
          required
        />

        {preview && (
          <div>
            <p className="text-sm text-gray-600 mb-2">
              Product Image
            </p>

            <img
              src={preview}
              alt={formData.name}
              className="w-40 h-40 object-cover rounded border"
            />
          </div>
        )}

        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full border p-3 rounded"
        />

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-black text-white px-8 py-3 rounded disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update Product"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/admin/products")}
            className="border border-gray-300 px-8 py-3 rounded hover:bg-gray-100"
          >
            Cancel
          </button>
        </div>
      </form>
    </AdminLayout>
  );
};

export default EditProduct;