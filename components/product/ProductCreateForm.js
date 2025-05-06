'use client'
import { useApiRequest } from "@/app/hooks/useApiRequest";
import { getCookie } from "@/app/lib/cookies";
import MultiSelect from "@/app/lib/MultiSelect";
import MultiSizeSelect from "@/app/lib/MultiSizeSelect";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";

const ProductCreateForm = ({ onSubmit, isSideSheet = false }) => {
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
    const [thumbnailImage, setThumbnailImage] = useState(null);
    const [thumbnailPreview, setThumbnailPreview] = useState(null);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedColors, setSelectedColors] = useState([]);
    const [selectedSizes, setSelectedSizes] = useState([]);
    const { makeRequest, loading, error } = useApiRequest();

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

                setCategories(response.data); // ✅ Assuming { success, message, data: [...] }
            } catch (err) {
                console.error("Error fetching categories:", err);
            }
        };

        fetchCategories();
    }, []);


    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim()) return;

        // Create FormData
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

        // Append Thumbnail Image
        if (thumbnailImage) {
            formData.append("product[thumbnail_image]", thumbnailImage);
        }

        // Append Multiple Product Images
        productImages.forEach((image) => {
            formData.append("product[images][]", image);
        });
        selectedColors.forEach((color, index) => {
            formData.append(`product[product_variants_attributes][${index}][color_id]`, color.value);
        });
        selectedSizes.forEach((size, index) => {
            formData.append(`product[product_variants_attributes][${index}][size_id]`, size.value);
        });
        onSubmit(formData); // Send FormData to parent
    };

    const handleColorChange = (newColors) => {
        // newColors is an array of { value: number, label: string }
        setSelectedColors(newColors);
    };
    const handleSizeChange = (newSizes) => {
        // newSizes is an array of { value: number, label: string }
        setSelectedSizes(newSizes);
    };
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);

        // Combine new files with existing ones
        setProductImages((prevImages) => [...prevImages, ...files]);

        // Generate previews for new files
        const newPreviews = files.map((file) => URL.createObjectURL(file));
        setPreviewImages((prevPreviews) => [...prevPreviews, ...newPreviews]);

        // Reset file input (important to allow re-selection)
        e.target.value = null;
    };

    const handleRemoveImage = (index) => {
        setProductImages((prevImages) => prevImages.filter((_, i) => i !== index));
        setPreviewImages((prevPreviews) => prevPreviews.filter((_, i) => i !== index));
    };
    const handleThumbnailChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setThumbnailImage(file);
            setThumbnailPreview(URL.createObjectURL(file));
        }
    };
    const handleRemoveThumbnail = () => {
        setThumbnailImage(null);
        setThumbnailPreview(null);
    };

    return (
        <div className={`${isSideSheet ? "w-full" : "max-w-7xl mx-auto p-6"} bg-background rounded-lg `}>
            <div>
                {isSideSheet ? "": (
                    <div className="text-lg font-semibold text-foreground">
                        Add product
                    </div>
                )}
            </div>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-8">
                {/* Title */}
                <div>
                    <Label htmlFor="title">Product Title</Label>
                    <Input
                        id="title"
                        type="text"
                        placeholder="Enter product title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
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
                    />
                </div>

                <div>
                    <Label htmlFor="category">Category</Label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
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
                    />
                </div>

                <div>
                    <label htmlFor="color" className="block text-sm font-medium">
                        Colors
                    </label>
                    <MultiSelect onChange={handleColorChange}/>
                </div>
                <div>
                    <label htmlFor="size" className="block text-sm font-medium">
                        Sizes
                    </label>
                    <MultiSizeSelect onChange={handleSizeChange}/>
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
                    />
                </div>

                {/* Currency (Dropdown) */}
                <div>
                    <Label htmlFor="currency">Currency</Label>
                    <Select value={currency} onValueChange={setCurrency}>
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

                {/* Trending (Checkbox) */}
                <div className="flex items-center space-x-4">
                    {/* Trending Checkbox */}
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="trending"
                            checked={trending}
                            onCheckedChange={(checked) => setTrending(checked)}
                        />
                        <Label htmlFor="trending">Trending</Label>
                    </div>

                    {/* Publish Checkbox */}
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="publish"
                            checked={publish}
                            onCheckedChange={(checked) => setPublish(checked)}
                        />
                        <Label htmlFor="publish">Publish</Label>
                    </div>
                </div>

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
                    />

                    {/* Image Preview Section */}
                    {previewImages.length > 0 && (
                        <div className="mt-4 flex flex-wrap">
                            {previewImages.map((preview, index) => (
                                <div key={index} className="m-1 relative">
                                    <img
                                        src={preview}
                                        alt={`Preview ${index + 1}`}
                                        className="w-32 h-32 rounded border shadow-md object-cover"
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
                </div>

                {/* Thumbnail Image (File Upload) */}
                <div>
                    <Label htmlFor="thumbnail_image">Thumbnail Image</Label>
                    <Input
                        id="thumbnail_image"
                        type="file"
                        onChange={(e) => handleThumbnailChange(e)}
                    />
                    {thumbnailPreview && (
                        <div className="mt-2 relative w-32 h-32">
                            <img
                                src={thumbnailPreview}
                                alt="Thumbnail Preview"
                                className="w-full h-full rounded border shadow-md object-cover"
                            />
                            <button
                                onClick={handleRemoveThumbnail}
                                className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full px-2 py-1"
                            >
                                ✕
                            </button>
                        </div>
                    )}
                </div>

                {/* Submit Button */}
                <Button type="submit" className="w-full bg-[#009EF7] text-white">
                    Save Product
                </Button>
            </form>
        </div>
    );
};

export default ProductCreateForm;
