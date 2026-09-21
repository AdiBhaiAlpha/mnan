import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShoppingBag, CheckCircle2, Phone, MessageCircle, Sparkles, X, Tag } from 'lucide-react';
import { Product } from '../types';

export const MarketplaceView: React.FC = () => {
  const { products, submitOrderInquiry, currentUser } = useApp();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [successNotice, setSuccessNotice] = useState(false);

  // Inquiry form states
  const [buyerName, setBuyerName] = useState(currentUser?.name || '');
  const [buyerBatch, setBuyerBatch] = useState(currentUser?.batch || 'SSC 2026');
  const [buyerPhone, setBuyerPhone] = useState(currentUser?.phone || '');
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState('L');
  const [notes, setNotes] = useState('');

  const openOrderModal = (product: Product) => {
    setSelectedProduct(product);
    if (currentUser) {
      setBuyerName(currentUser.name);
      setBuyerBatch(currentUser.batch);
      setBuyerPhone(currentUser.phone || '');
    }
    if (product.availableSizes && product.availableSizes.length > 0) {
      setSize(product.availableSizes[0]);
    }
    setOrderModalOpen(true);
    setSuccessNotice(false);
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    submitOrderInquiry({
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      buyerName: buyerName.trim(),
      buyerBatch: buyerBatch.trim(),
      buyerPhone: buyerPhone.trim(),
      quantity: Number(quantity) || 1,
      size: selectedProduct.availableSizes ? size : undefined,
      notes: notes.trim() || undefined
    });

    setSuccessNotice(true);
    setTimeout(() => {
      setSuccessNotice(false);
      setOrderModalOpen(false);
      setNotes('');
    }, 2500);
  };

  return (
    <div id="marketplace-page" className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-900 text-xs font-bold border border-blue-100">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>অফিশিয়াল পুনর্মিলনী স্যুভেনিয়ার ও স্মারক</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            মুকুল নিকেতন স্মারক সংগ্রহ ও স্টোর
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
            মুকুল নিকেতন পুনর্মিলনীর অফিসিয়াল টি-শার্ট, হুডি ও স্যুভেনিয়ার সংগ্রহ করুন। সকল মার্চেন্ডাইজের আয় পুনর্মিলনী তহবিলে যুক্ত হবে।
          </p>
        </div>

        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-1 shrink-0">
          <div className="font-bold text-slate-900 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>প্রি-অর্ডার ও সরাসরি সংগ্রহ</span>
          </div>
          <p>বিদ্যালয় ক্যাম্পাসের বুথ থেকে সরাসরি সংগ্রহ বা কুরিয়ার সুবিধা।</p>
        </div>
      </div>

      {/* Product Showcase Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map(product => (
          <div
            key={product.id}
            id={`product-card-${product.id}`}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between group"
          >
            <div>
              {/* Product Image */}
              <div className="relative h-56 bg-slate-100 overflow-hidden">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute top-3 left-3 bg-blue-950/80 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-1 rounded-md">
                  {product.category}
                </div>
                <div className="absolute top-3 right-3 bg-amber-400 text-slate-950 text-xs font-black px-2.5 py-1 rounded-md shadow-xs">
                  ৳{product.price}
                </div>
              </div>

              {/* Product Content */}
              <div className="p-4 space-y-2">
                <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-blue-900 transition">
                  {product.name}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {product.description}
                </p>

                {product.availableSizes && product.availableSizes.length > 0 && (
                  <div className="flex items-center gap-1.5 pt-1">
                    <span className="text-[11px] text-slate-400 font-semibold">সাইজ:</span>
                    <div className="flex gap-1">
                      {product.availableSizes.map(sz => (
                        <span key={sz} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-bold">
                          {sz}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Order/Contact Button */}
            <div className="p-4 pt-0">
              <button
                id={`order-btn-${product.id}`}
                onClick={() => openOrderModal(product)}
                className="w-full py-2.5 bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs rounded-xl transition shadow-xs flex items-center justify-center gap-1.5"
              >
                <Tag className="w-3.5 h-3.5 text-amber-300" />
                <span>অর্ডার ও অনুসন্ধান</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Inquiry & Order Modal */}
      {orderModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => setOrderModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            {successNotice ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">অর্ডার অনুসন্ধান জমা হয়েছে!</h3>
                <p className="text-xs text-slate-600 max-w-sm mx-auto">
                  ধন্যবাদ, <span className="font-semibold">{buyerName}</span>। আপনার স্মারক <span className="font-semibold">{selectedProduct.name}</span> এর জন্য অনুরোধটি নথিভুক্ত হয়েছে। সমন্বয়কারী কমিটি আপনার নম্বরে ({buyerPhone}) দ্রুত যোগাযোগ করবে।
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitOrder} className="space-y-4">
                <div>
                  <div className="text-xs font-bold text-blue-900 uppercase tracking-wider">স্মারক অর্ডার অনুসন্ধান</div>
                  <h3 className="text-lg font-bold text-slate-900 mt-0.5">{selectedProduct.name}</h3>
                  <div className="text-sm font-extrabold text-amber-600">মূল্য: ৳{selectedProduct.price} টাকা</div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">আপনার নাম</label>
                    <input
                      type="text"
                      required
                      value={buyerName}
                      onChange={(e) => setBuyerName(e.target.value)}
                      placeholder="পূর্ণ নাম"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-blue-900 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">ব্যাচ / এসএসসি সন</label>
                    <input
                      type="text"
                      required
                      value={buyerBatch}
                      onChange={(e) => setBuyerBatch(e.target.value)}
                      placeholder="যেমন: SSC 2026"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-blue-900 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">মোবাইল নম্বর / হোয়াটসঅ্যাপ</label>
                    <input
                      type="tel"
                      required
                      value={buyerPhone}
                      onChange={(e) => setBuyerPhone(e.target.value)}
                      placeholder="০১৭১... বা ০১৮১..."
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-blue-900 focus:outline-hidden"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">পরিমাণ</label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={quantity}
                        onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-blue-900 focus:outline-hidden"
                      />
                    </div>

                    {selectedProduct.availableSizes && selectedProduct.availableSizes.length > 0 ? (
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">সাইজ</label>
                        <select
                          value={size}
                          onChange={(e) => setSize(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-blue-900 focus:outline-hidden"
                        >
                          {selectedProduct.availableSizes.map(sz => (
                            <option key={sz} value={sz}>{sz}</option>
                          ))}
                        </select>
                      </div>
                    ) : (
                      <div>
                        <label className="block text-xs font-bold text-slate-400 mb-1">সাইজ</label>
                        <input
                          disabled
                          value="Standard"
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-100 bg-slate-100 text-slate-400"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">ঠিকানা বা বিশেষ মন্তব্য (ঐচ্ছিক)</label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="যেমন: ক্যাম্পাসের বুথ থেকে সরাসরি সংগ্রহ করা হবে"
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-blue-900 focus:outline-hidden resize-none"
                  />
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5">
                  <button
                    type="submit"
                    id="submit-order-inquiry-btn"
                    className="w-full sm:flex-1 py-3 bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-xs transition"
                  >
                    প্রি-অর্ডার আবেদন জমা দিন (৳{selectedProduct.price * quantity} টাকা)
                  </button>

                  <a
                    href="https://wa.me/8801711000000"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>হোয়াটসঅ্যাপ</span>
                  </a>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
