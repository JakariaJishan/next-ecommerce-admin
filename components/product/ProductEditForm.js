import { useApiRequest } from "@/app/hooks/useApiRequest";
import { getCookie } from "@/app/lib/cookies";
import MultiSelectEdit from "@/app/lib/MultiSelectEdit";
import MultiSizeSelectEdit from "@/app/lib/MultiSizeSelectEdit";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

const ProductEditForm = ({ productId, onClose }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [stockQuantity, setStockQuantity] = useState("");
  const [minStockQuantity, setMinStockQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [currency, setCurrency] = useState("usd");
  const [trending, setTrending] = useState(false);
  const [publish, setPublish] = useState(false);
  const [productImages, setProductImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [deletedImages, setDeletedImages] = useState([]);
  const [thumbnailImage, setThumbnailImage] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [deletedThumbnail, setDeletedThumbnail] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const { makeRequest, loading, error, data } = useApiRequest();

  // Fetch product details when component mounts
  useEffect(() => {
    if (!productId) return;

    const fetchProductDetails = async () => {
      try {
        const token = getCookie("token");
        if (!token) {
          toast.error("No token found!");
          return;
        }

        const response = await makeRequest({
          url: `${process.env.NEXT_PUBLIC_API_URL}/products/${productId}/vendor_product_detail`,
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setTitle(response.data.title || "");
        setDescription(response.data.description || "");
        setStockQuantity(response.data.stock_quantity || "");
        setMinStockQuantity(response.data.min_stock_count || "");
        setPrice(response.data.price || "");
        setCurrency(response.data.currency || "usd");
        setTrending(response.data.trending || false);
        setPublish(response.data.publish || false);
        setCategories(response.data.categories || []);
        setSelectedCategory(response.data.category_id?.toString() || "");
        const existingImages = response.data.image_urls || [];
        setProductImages(existingImages);
        setPreviewImages(existingImages);
        setThumbnailPreview(response.data.thumbnail_image_url);
        const initialColors =
          response.data.colors?.map((color) => ({
            value: color.id, // Convert `id` to `value`
            label: color.name, // Convert `name` to `label`
            hexCode: color.hex_code, // Store hex code for reference
          })) || [];
        setSelectedColors(initialColors);
        const initialSizes = response.data.sizes.map((size) => ({
          value: size.id,
          label: size.name,
        }));
        setSelectedSizes(initialSizes);
      } catch (err) {
        toast.error("Error fetching product details.");
      }
    };

    fetchProductDetails();
  }, [productId]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = getCookie("token"); // Get token from cookies
        const response = await makeRequest({
          url: `${process.env.NEXT_PUBLIC_API_URL}/categories/vendor_categories`,
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setCategories(response.data || []); // ✅ Assuming { success, message, data: [...] }
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };

    fetchCategories();
  }, [productId]); // ✅ Depend on `productId`

  const handleUpdate = async () => {
    try {
      const token = getCookie("token");
      if (!token) {
        toast.error("No token found!");
        return;
      }

      // ✅ Create FormData for PATCH request
      const formData = new FormData();
      formData.append("product[title]", title);
      formData.append("product[description]", description);
      formData.append("product[stock_quantity]", stockQuantity);
      formData.append("product[min_stock_count]", minStockQuantity);
      formData.append("product[price]", price);
      formData.append("product[currency]", currency);
      formData.append("product[trending]", trending);
      formData.append("product[publish]", publish);
      formData.append("product[category_id]", selectedCategory);

      // ✅ Append Selected Colors
      selectedColors.forEach((color, index) => {
        formData.append(
          `product[product_variants_attributes][${index}][color_id]`,
          color.value
        );
      });

      // ✅ Append Selected Sizes
      selectedSizes.forEach((size, index) => {
        formData.append(
          `product[product_variants_attributes][${index}][size_id]`,
          size.value
        );
      });
      // ✅ Append only NEW images (files)
      productImages.forEach((image) => {
        if (image instanceof File) {
          formData.append(`product[images][]`, image);
        }
      });

      // ✅ Append deleted images (URLs to be removed)
      deletedImages.forEach((imageUrl, index) => {
        formData.append(`product[deleted_images][${index}]`, imageUrl);
      });
      // ✅ Append the NEW thumbnail (if a file was selected)
      if (thumbnailImage instanceof File) {
        formData.append("product[thumbnail_image]", thumbnailImage);
      }

      // ✅ Append deleted thumbnail (if applicable)
      if (deletedThumbnail) {
        formData.append("product[deleted_thumbnail]", deletedThumbnail);
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products/${productId}`,
        {
          method: "PATCH", // ✅ Use PATCH instead of PUT for partial updates
          headers: {
            Authorization: `Bearer ${token}`, // ✅ Do NOT set Content-Type when using FormData
          },
          body: formData,
        }
      );

      if (!response.ok) throw new Error("Failed to update product");

      toast.success("Product updated successfully!");
      onClose(); // ✅ Close the sheet after update
    } catch (error) {
      toast.error("Error updating product.");
    }
  };

  const handleColorChange = (newColors) => {
    setSelectedColors(newColors);
  };
  const handleSizeChange = (newSizes) => {
    setSelectedSizes(newSizes);
  };
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    // ✅ Only add new files to the productImages state
    setProductImages((prevImages) => [
      ...prevImages.filter((img) => typeof img === "string"), // Keep existing images (URLs from backend)
      ...files, // Add only new files
    ]);

    // ✅ Generate previews for newly uploaded images
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages((prevPreviews) => [...prevPreviews, ...newPreviews]);
  };

  const handleRemoveImage = (index) => {
    setProductImages((prevImages) => {
      const newImages = [...prevImages];
      const removedImage = newImages.splice(index, 1)[0];

      // ✅ If the removed image is from the server (not a File object), track it separately
      if (typeof removedImage === "string") {
        setDeletedImages((prevDeleted) => [...prevDeleted, removedImage]);
      }

      return newImages;
    });

    // ✅ Remove from Preview Images as well
    setPreviewImages((prevPreviews) =>
      prevPreviews.filter((_, i) => i !== index)
    );
  };
  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setThumbnailImage(file); // Store the new thumbnail file
      setThumbnailPreview(URL.createObjectURL(file)); // Generate a preview

      // If replacing an existing thumbnail, track the old one for deletion
      if (thumbnailImage && typeof thumbnailImage === "string") {
        setDeletedThumbnail(thumbnailImage);
      }
    }
  };
  const handleRemoveThumbnail = () => {
    if (thumbnailImage && typeof thumbnailImage === "string") {
      setDeletedThumbnail(thumbnailImage); // Track the existing thumbnail for deletion
    }

    setThumbnailImage(null);
    setThumbnailPreview(null);
  };

  return (
    <div className="space-y-4">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div>
            <Label htmlFor="title">Product Title</Label>
            <Input
              id="title"
              type="text"
              placeholder="Enter product title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              disabled
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Product Description</Label>
            <Textarea
              id="description"
              placeholder="Enter product description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              disabled
            />
          </div>

          <div>
            <label htmlFor="color" className="block text-sm font-medium">
              Colors
            </label>
            <MultiSelectEdit
              value={selectedColors}
              onChange={handleColorChange}
              disabled
            />
          </div>
          <div>
            <label htmlFor="size" className="block text-sm font-medium">
              Sizes
            </label>
            <MultiSizeSelectEdit
              value={selectedSizes}
              onChange={handleSizeChange}
              disabled
            />
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
              disabled
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="stock_quantity">Stock Quantity</Label>
            <Input
              id="stock_quantity"
              type="number"
              placeholder="Enter stock quantity"
              value={stockQuantity}
              onChange={(e) => setStockQuantity(e.target.value)}
              required
              disabled
            />
          </div>

          <div>
            <Label htmlFor="min_stock_quantity">Minimum Stock Quantity</Label>
            <Input
              id="min_stock_quantity"
              type="number"
              placeholder="Enter min stock quantity"
              value={minStockQuantity}
              onChange={(e) => setMinStockQuantity(e.target.value)}
              required
              disabled
            />
          </div>

          {/* Price (Number Input) */}
          <div>
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              type="number"
              placeholder="Enter price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              disabled
            />
          </div>

          {/* Currency (Dropdown) */}
          <div>
            <Label htmlFor="currency">Currency</Label>
            <Select value={currency} onValueChange={setCurrency} disabled>
              <SelectTrigger id="currency">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bdt">BDT</SelectItem>
                <SelectItem value="usd">USD</SelectItem>
                <SelectItem value="eur">EUR</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* Status (Dropdown) */}
          <div>
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={setCurrency}>
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="sold">Sold</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* Trending (Checkbox) */}
          <div className="flex items-center space-x-4">
            {/* Trending Checkbox */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="trending"
                checked={trending}
                onCheckedChange={(checked) => setTrending(checked)}
                disabled
              />
              <Label htmlFor="trending">Trending</Label>
            </div>

            {/* Publish Checkbox */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="publish"
                checked={publish}
                onCheckedChange={(checked) => setPublish(checked)}
                disabled
              />
              <Label htmlFor="publish">Publish</Label>
            </div>
          </div>

          {previewImages.length > 0 && (
            <div className="mt-4 flex flex-wrap">
              {previewImages.map((preview, index) => (
                <div key={index} className="m-1 relative w-32 h-32">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full rounded border shadow-md object-cover"
                  />
                  <button
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full px-2 py-1"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          <div>
            <label htmlFor="images" className="block text-sm font-medium">
              Product Images
            </label>
            <Input
              type="file"
              id="images"
              name="images"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="mt-1 p-2 border rounded w-full"
              disabled
            />
          </div>
          {/* Thumbnail Image Section */}
          <div className="mb-4">
            <label
              htmlFor="thumbnail_image"
              className="block text-sm font-medium"
            >
              Thumbnail Image
            </label>

            {/* Thumbnail Preview */}
            {thumbnailPreview && (
              <div className="mt-4 relative w-32 h-32">
                <img
                  src={thumbnailPreview}
                  alt="Thumbnail Preview"
                  className="w-full h-full rounded border shadow-md object-cover"
                />
                {/*<button*/}
                {/*    onClick={handleRemoveThumbnail}*/}
                {/*    className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full px-2 py-1"*/}
                {/*>*/}
                {/*    ✕*/}
                {/*</button>*/}
              </div>
            )}

            {/* Thumbnail Upload Input */}
            <Input
              type="file"
              id="thumbnail_image"
              name="thumbnail_image"
              accept="image/*"
              onChange={handleThumbnailChange}
              className="mt-1 p-2 border rounded w-full"
              disabled
            />
          </div>

          <Button onClick={handleUpdate}>Save Changes</Button>
        </>
      )}
    </div>
  );
};

export default ProductEditForm;
