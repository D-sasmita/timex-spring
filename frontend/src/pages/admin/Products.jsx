import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Pencil, Trash2, Plus } from "lucide-react";
import API from "../../api/axios";
import AdminLayout from "../../components/AdminLayout";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await API.get("/products");
      setProducts(data);
    } catch (err) {
      console.error(err);
      alert("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) return;

    try {
      await API.delete(`/products/${id}`);
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert(
        err.response?.data?.message ||
          "Failed to delete product"
      );
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <h2 className="text-2xl font-bold">
          Loading Products...
        </h2>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">
          Products
        </h1>

        <Link
          to="/admin/products/new"
          className="bg-black text-white px-5 py-3 rounded-lg flex items-center gap-2"
        >
          <Plus size={18} />
          Add Product
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-black text-white">
            <tr>
              <th className="p-4">Image</th>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Category</th>
              <th className="p-4 text-left">Price</th>
              <th className="p-4 text-left">Stock</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => (
              <tr
                key={product.id}
                className="border-b hover:bg-gray-50"
              >
                <td className="p-4">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                </td>

                <td className="p-4 font-medium">
                  {product.name}
                </td>

                <td className="p-4">
                  {product.category}
                </td>

                <td className="p-4">
                  ₹{product.price}
                </td>

                <td className="p-4">
                  {product.stockQuantity}
                </td>

                <td className="p-4">
                  <div className="flex justify-center gap-3">
                    <Link
                      to={`/admin/products/${product.id}/edit`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Pencil size={20} />
                    </Link>

                    <button
                      onClick={() =>
                        deleteProduct(product.id)
                      }
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default Products;