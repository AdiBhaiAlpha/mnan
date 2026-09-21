import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ImageUploaderBox } from './ImageUploaderBox';
import { isAdminName } from '../types';
import { 
  MessageSquare, 
  Heart, 
  Send, 
  Image as ImageIcon, 
  Trash2, 
  Calendar, 
  MapPin, 
  Clock, 
  Lock, 
  Ticket, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  X
} from 'lucide-react';

export const CommunityView: React.FC = () => {
  const { posts, events, currentUser, users, viewProfile, createPost, toggleLike, addComment, deleteComment, deletePost, deleteEvent, toggleRsvp, setActiveTab } = useApp();
  const [postText, setPostText] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [showImageInput, setShowImageInput] = useState(false);
  const [isEventPost, setIsEventPost] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('সকাল ১০:০০ টা');
  const [eventVenue, setEventVenue] = useState('মুকুল নিকেতন প্রাঙ্গণ, ময়মনসিংহ');
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [postNotice, setPostNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [deletingPostId, setDeletingPostId] = useState<string | null>(null);

  const canPost = currentUser && (currentUser.status === 'approved' || currentUser.role === 'admin');

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postText.trim() && !eventTitle.trim()) return;

    const eventDetails = isEventPost && eventTitle.trim() ? {
      title: eventTitle.trim(),
      date: eventDate.trim() || 'তারিখ শীঘ্রই জানানো হবে',
      time: eventTime.trim() || 'সকাল ১০:০০ টা',
      venue: eventVenue.trim() || 'মুকুল নিকেতন প্রাঙ্গণ, ময়মনসিংহ',
      description: postText.trim() || eventTitle.trim(),
      bannerUrl: imageUrl.trim() || undefined
    } : undefined;

    const res = createPost(
      postText.trim() || (eventTitle ? `আমাদের নতুন অনুষ্ঠান "${eventTitle}" এ সকলের আন্তরিক আমন্ত্রণ!` : ''),
      imageUrl.trim() || undefined,
      eventDetails
    );

    if (res.success) {
      setPostText('');
      setImageUrl('');
      setShowImageInput(false);
      setIsEventPost(false);
      setEventTitle('');
      setEventDate('');
      setEventTime('সকাল ১০:০০ টা');
      setEventVenue('মুকুল নিকেতন প্রাঙ্গণ, ময়মনসিংহ');
      setPostNotice({ type: 'success', text: res.message });
      setTimeout(() => setPostNotice(null), 5000);
    } else {
      setPostNotice({ type: 'error', text: res.message });
    }
  };

  const handleAddComment = (postId: string) => {
    const text = commentInputs[postId]?.trim();
    if (!text) return;
    addComment(postId, text);
    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
  };

  return (
    <div id="community-feed-page" className="max-w-2xl mx-auto space-y-6 pb-16">
      {/* Header Banner */}
      <div className="bg-white rounded-none p-4 border border-slate-200 shadow-xs">
        <h1 className="text-xl font-extrabold text-slate-900">আলাপ পাতা</h1>
      </div>

      {/* Post Creator Box */}
      <div className="bg-white rounded-none border border-slate-200 p-5 shadow-xs">
        {!currentUser ? (
          <div className="p-4 bg-slate-50 rounded-none border border-slate-200 text-center space-y-3">
            <Lock className="w-6 h-6 text-slate-400 mx-auto" />
            <div className="text-sm font-bold text-slate-800">আলাপে অংশ নিতে ও ইভেন্ট পোস্ট করতে লগইন করুন</div>
            <p className="text-xs text-slate-500">শুধুমাত্র মুকুল নিকেতনের ভেরিফাইড প্রাক্তনীরা পোস্ট তৈরি ও অনুষ্ঠান ঘোষণা করতে পারেন।</p>
            <div className="flex justify-center gap-3 pt-1">
              <button
                onClick={() => setActiveTab('login')}
                className="px-4 py-2 bg-blue-900 text-white rounded-none text-xs font-bold"
              >
                লগইন করুন
              </button>
              <button
                onClick={() => setActiveTab('register')}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-none text-xs font-bold"
              >
                নিবন্ধন করুন
              </button>
            </div>
          </div>
        ) : !canPost ? (
          <div className="p-4 bg-amber-50 rounded-none border border-amber-200 text-xs sm:text-sm text-amber-900 space-y-2">
            <div className="flex items-center gap-2 font-bold">
              <Clock className="w-4 h-4 text-amber-700" />
              <span>পোস্ট করার সুবিধা: অ্যাডমিন অনুমোদনের অপেক্ষায়</span>
            </div>
            <p className="text-xs text-amber-800">
              স্বাগতম, <span className="font-semibold">{currentUser.name}</span>। আপনার প্রোফাইলটি বর্তমানে যাচাইয়ের অপেক্ষায় রয়েছে। অনুমোদন সম্পন্ন হলে আপনি এখানে স্মৃতিচারণ ও নতুন অনুষ্ঠান ঘোষণা করতে পারবেন।
            </p>
          </div>
        ) : (
          <form onSubmit={handleCreatePost} className="space-y-4">
            <div className="flex items-start gap-3">
              <button
                type="button"
                onClick={() => currentUser && viewProfile(currentUser.id)}
                className="shrink-0 cursor-pointer hover:opacity-80 transition"
                title={`${currentUser.name}-এর প্রোফাইল দেখুন`}
              >
                <img
                  src={currentUser.profilePhoto}
                  alt={currentUser.name}
                  className="w-10 h-10 rounded-none object-cover border border-slate-200"
                />
              </button>
              <div className="flex-1 space-y-3">
                <textarea
                  id="community-post-textarea"
                  value={postText}
                  onChange={(e) => setPostText(e.target.value)}
                  placeholder={
                    isEventPost
                      ? "অনুষ্ঠানের বিস্তারিত বিবরণ, আমন্ত্রণ বার্তা বা নির্দেশনা লিখুন..."
                      : `মুকুল নিকেতনের কী স্মৃতি বা খবর শেয়ার করতে চান, ${currentUser.name.split(' ')[0]}?`
                  }
                  rows={isEventPost ? 2 : 3}
                  className="w-full p-3 rounded-none border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-900 focus:border-transparent text-sm bg-slate-50 focus:bg-white transition resize-none"
                />

                {/* Event Details Form when isEventPost is enabled */}
                {isEventPost && (
                  <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-none space-y-3 text-xs">
                    <div className="flex items-center justify-between font-bold text-amber-950 border-b border-amber-200 pb-1.5">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-amber-800" />
                        <span>অনুষ্ঠান / ইভেন্টের বিবরণ (হোমপেজে প্রদর্শিত হবে)</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsEventPost(false)}
                        className="text-slate-500 hover:text-red-600 transition"
                        title="ইভেন্ট বাতিল করুন"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div className="sm:col-span-2">
                        <label className="block font-semibold text-slate-800 mb-1">
                          অনুষ্ঠানের নাম / শিরোনাম <span className="text-red-600">*</span>
                        </label>
                        <input
                          id="event-title-input"
                          type="text"
                          required
                          value={eventTitle}
                          onChange={(e) => setEventTitle(e.target.value)}
                          placeholder="যেমন: এসএসসি ব্যাচ ২০০০ পুনর্মিলনী মেলা"
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-none text-xs focus:ring-1 focus:ring-blue-900 focus:outline-hidden"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-800 mb-1">তারিখ</label>
                        <input
                          id="event-date-input"
                          type="text"
                          value={eventDate}
                          onChange={(e) => setEventDate(e.target.value)}
                          placeholder="যেমন: ২৫ ডিসেম্বর, ২০২৬"
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-none text-xs focus:ring-1 focus:ring-blue-900 focus:outline-hidden"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-800 mb-1">সময়</label>
                        <input
                          id="event-time-input"
                          type="text"
                          value={eventTime}
                          onChange={(e) => setEventTime(e.target.value)}
                          placeholder="যেমন: সকাল ১০:০০ টা"
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-none text-xs focus:ring-1 focus:ring-blue-900 focus:outline-hidden"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block font-semibold text-slate-800 mb-1">স্থান / ভেন্যু</label>
                        <input
                          id="event-venue-input"
                          type="text"
                          value={eventVenue}
                          onChange={(e) => setEventVenue(e.target.value)}
                          placeholder="যেমন: মুকুল নিকেতন প্রাঙ্গণ, ময়মনসিংহ"
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-none text-xs focus:ring-1 focus:ring-blue-900 focus:outline-hidden"
                        />
                      </div>
                    </div>

                    <p className="text-[11px] text-amber-900/80 bg-amber-100/50 p-2 border border-amber-200/60">
                      💡 পোস্ট করার পর এই ইভেন্টটি সরাসরি হোমপেজের <strong>"আসন্ন অনুষ্ঠান ও সমাবেশ"</strong> স্পটলাইটে চলে যাবে এবং প্রাক্তনীরা সাইন আপ করে আসন বুক করতে পারবে।
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Optional Image Input */}
            {showImageInput && (
              <div className="pl-13 space-y-2">
                <ImageUploaderBox
                  label="ছবি নির্বাচন করুন (Image Upload)"
                  value={imageUrl}
                  onChange={(url) => setImageUrl(url)}
                  aspect="banner"
                  id="post-image-url-input"
                  placeholder="পোস্টে যুক্ত করার জন্য ছবি সিলেক্ট করুন"
                />
              </div>
            )}

            {postNotice && (
              <div className={`text-xs p-2.5 rounded-none border ${postNotice.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : 'bg-red-50 text-red-800 border-red-300'}`}>
                {postNotice.text}
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 pl-13">
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  id="toggle-post-event-btn"
                  onClick={() => setIsEventPost(!isEventPost)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-none text-xs font-semibold transition border ${
                    isEventPost ? 'bg-amber-100 text-amber-950 border-amber-400' : 'text-slate-700 hover:bg-slate-100 border-slate-200'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5 text-amber-800" />
                  <span>{isEventPost ? '✓ ইভেন্ট যুক্ত আছে' : 'অনুষ্ঠান / ইভেন্ট পোস্ট করুন'}</span>
                </button>

                <button
                  type="button"
                  id="toggle-post-image-btn"
                  onClick={() => setShowImageInput(!showImageInput)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-none text-xs font-semibold transition border ${
                    showImageInput ? 'bg-blue-50 text-blue-900 border-blue-200' : 'text-slate-600 hover:bg-slate-100 border-slate-200'
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5 text-slate-500" />
                  <span>{showImageInput ? 'ছবি লুকান' : 'ছবি'}</span>
                </button>
              </div>

              <button
                type="submit"
                id="publish-post-btn"
                disabled={!postText.trim() && !eventTitle.trim()}
                className="px-4 py-2 bg-blue-900 hover:bg-blue-800 disabled:opacity-50 text-white font-bold text-xs rounded-none transition shadow-xs flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isEventPost ? 'ইভেন্ট ও পোস্ট প্রকাশ করুন' : 'পোস্ট প্রকাশ করুন'}</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Feed List */}
      <div className="space-y-5">
        {posts.map(post => {
          const hasLiked = currentUser ? post.likes.includes(currentUser.id) : false;
          const isAuthor = currentUser?.id === post.authorId;
          const isAdmin = currentUser?.role === 'admin' || (currentUser ? isAdminName(currentUser.name) : false);
          const linkedEvent = post.eventId ? events.find(e => e.id === post.eventId) : null;
          const isBooked = linkedEvent && currentUser ? linkedEvent.rsvps.includes(currentUser.id) : false;

          // Dynamically fetch updated profile info from users array
          const authorUser = users.find(u => u.id === post.authorId || u.name === post.authorName);
          const authorAvatar = authorUser?.profilePhoto || post.authorAvatar;
          const authorName = authorUser?.name || post.authorName;

          return (
            <article
              key={post.id}
              id={`community-post-${post.id}`}
              className="bg-white rounded-none border border-slate-200 p-5 shadow-xs space-y-4"
            >
              {/* Author header */}
              <div className="flex items-start justify-between">
                <button
                  type="button"
                  onClick={() => {
                    if (authorUser?.id) {
                      viewProfile(authorUser.id);
                    } else if (post.authorId) {
                      viewProfile(post.authorId);
                    }
                  }}
                  className="flex items-center gap-3 text-left group/author cursor-pointer"
                  title={`${authorName}-এর প্রোফাইল দেখুন`}
                >
                  <img
                    src={authorAvatar}
                    alt={authorName}
                    className="w-10 h-10 rounded-none object-cover border border-slate-100 group-hover/author:border-blue-900 group-hover/author:scale-105 transition"
                  />
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-slate-900 text-sm group-hover/author:text-blue-900 transition">
                        {authorName}
                      </span>
                    </div>
                  </div>
                </button>

                {(isAuthor || isAdmin) && (
                  <button
                    id={`delete-post-${post.id}`}
                    onClick={() => setDeletingPostId(post.id)}
                    title={isAdmin && !isAuthor ? "অ্যাডমিন হিসেবে পোস্ট ডিলিট করুন" : "পোস্ট মুছে ফেলুন"}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-none transition flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                    {isAdmin && !isAuthor && (
                      <span className="text-[10px] font-bold text-red-600 hidden sm:inline">ডিলিট</span>
                    )}
                  </button>
                )}
              </div>

              {/* Post Content */}
              <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-line">
                {post.content}
              </p>

              {/* Event Card if attached */}
              {(linkedEvent || post.eventData) && (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-none space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-blue-900 uppercase tracking-wider mb-1">
                        <Calendar className="w-3.5 h-3.5 text-blue-800" />
                        <span>আসন্ন অনুষ্ঠান বিবরণ</span>
                      </div>
                      <h4 className="text-base font-extrabold text-slate-900">
                        {linkedEvent?.title || post.eventData?.title}
                      </h4>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-blue-800 shrink-0" />
                      <span>{linkedEvent?.date || post.eventData?.date} • {linkedEvent?.time || post.eventData?.time}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-red-600 shrink-0" />
                      <span className="truncate">{linkedEvent?.venue || post.eventData?.venue}</span>
                    </div>
                  </div>

                  {/* Booking and Home Spotlight Navigation */}
                  <div className="pt-2 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
                    {linkedEvent ? (
                      currentUser ? (
                        <button
                          id={`post-event-book-btn-${linkedEvent.id}`}
                          onClick={() => toggleRsvp(linkedEvent.id)}
                          className={`px-3.5 py-1.5 rounded-none font-bold text-xs transition flex items-center gap-1.5 border ${
                            isBooked 
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100' 
                              : 'bg-blue-900 hover:bg-blue-800 text-white border-blue-900'
                          }`}
                        >
                          {isBooked ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>বুকিং সম্পন্ন ({linkedEvent.attendeeCount})</span>
                            </>
                          ) : (
                            <>
                              <Ticket className="w-3.5 h-3.5 text-amber-300" />
                              <span>অনুষ্ঠান বুক করুন ({linkedEvent.attendeeCount})</span>
                            </>
                          )}
                        </button>
                      ) : (
                        <button
                          onClick={() => setActiveTab('register')}
                          className="px-3.5 py-1.5 bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs rounded-none transition flex items-center gap-1.5"
                        >
                          <Lock className="w-3.5 h-3.5 text-amber-300" />
                          <span>বুক করতে সাইন আপ করুন</span>
                        </button>
                      )
                    ) : null}

                    <div className="flex items-center gap-2 ml-auto">
                      {linkedEvent && (isAdmin || isAuthor) && (
                        <button
                          id={`delete-event-from-post-${linkedEvent.id}`}
                          onClick={() => {
                            if (window.confirm(`আপনি কি "${linkedEvent.title}" অনুষ্ঠানটি ডিলিট করতে চান?`)) {
                              deleteEvent(linkedEvent.id);
                            }
                          }}
                          className="px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold rounded-none border border-red-200 transition flex items-center gap-1"
                          title="অনুষ্ঠান ডিলিট করুন"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>ইভেন্ট ডিলিট</span>
                        </button>
                      )}
                      <button
                        onClick={() => setActiveTab('home')}
                        className="text-xs font-semibold text-blue-900 hover:text-blue-700 flex items-center gap-1 transition"
                      >
                        <span>হোমপেজের ইভেন্টে দেখুন</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Optional Photo */}
              {post.imageUrl && (
                <div className="rounded-none overflow-hidden border border-slate-100 bg-slate-50 max-h-96">
                  <img
                    src={post.imageUrl}
                    alt="Post media"
                    className="w-full h-auto object-cover max-h-96"
                    loading="lazy"
                  />
                </div>
              )}

              {/* Action bar: Likes & Comments */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <button
                  id={`like-post-btn-${post.id}`}
                  onClick={() => toggleLike(post.id)}
                  disabled={!currentUser}
                  className={`flex items-center gap-1.5 py-1.5 px-3 rounded-none font-semibold transition ${
                    hasLiked
                      ? 'text-rose-600 bg-rose-50'
                      : 'hover:bg-slate-100 text-slate-600'
                  } ${!currentUser ? 'cursor-not-allowed opacity-70' : ''}`}
                >
                  <Heart className={`w-4 h-4 ${hasLiked ? 'fill-rose-600 text-rose-600' : ''}`} />
                  <span>{post.likes.length} টি পছন্দ</span>
                </button>

                <button
                  id={`comment-toggle-btn-${post.id}`}
                  onClick={() => setActiveCommentPostId(activeCommentPostId === post.id ? null : post.id)}
                  className="flex items-center gap-1.5 py-1.5 px-3 rounded-none hover:bg-slate-100 text-slate-600 font-semibold transition"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>{post.comments.length} টি মন্তব্য</span>
                </button>
              </div>

              {/* Comments Section */}
              {activeCommentPostId === post.id && (
                <div className="space-y-3 pt-1">
                  {post.comments.length > 0 && (
                    <div className="space-y-2.5 bg-slate-50 p-3 rounded-none border border-slate-100">
                      {post.comments.map(c => {
                        const commentAuthor = users.find(u => u.id === c.authorId || u.name === c.authorName);
                        const commentAvatar = commentAuthor?.profilePhoto || c.authorAvatar;
                        const commentName = commentAuthor?.name || c.authorName;

                        return (
                          <div key={c.id} className="text-xs space-y-1 pb-2 border-b border-slate-200/60 last:border-0 last:pb-0">
                            <div className="flex items-center justify-between gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  if (commentAuthor?.id) {
                                    viewProfile(commentAuthor.id);
                                  } else if (c.authorId) {
                                    viewProfile(c.authorId);
                                  }
                                }}
                                className="flex items-center gap-2 text-left group/comm-author cursor-pointer"
                                title={`${commentName}-এর প্রোফাইল দেখুন`}
                              >
                                <img
                                  src={commentAvatar}
                                  alt={commentName}
                                  className="w-5 h-5 rounded-none object-cover border border-slate-200 group-hover/comm-author:border-blue-900 transition"
                                />
                                <span className="font-bold text-slate-800 text-xs group-hover/comm-author:text-blue-900 transition">
                                  {commentName}
                                </span>
                              </button>

                              <div className="flex items-center gap-2">
                                <span className="text-[10px] text-slate-400 font-normal">{c.createdAt}</span>
                                {(currentUser?.id === c.authorId || isAdmin) && (
                                  <button
                                    onClick={() => {
                                      if (window.confirm('কমেন্টটি মুছে ফেলতে চান?')) {
                                        deleteComment(post.id, c.id);
                                      }
                                    }}
                                    className="text-slate-400 hover:text-red-600 p-0.5 transition cursor-pointer"
                                    title="কমেন্ট ডিলিট করুন"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                )}
                              </div>
                            </div>
                            <p className="text-slate-700 text-xs pl-7">{c.content}</p>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Comment input if approved/logged in */}
                  {currentUser && canPost && (
                    <div className="flex items-center gap-2 pt-1">
                      <input
                        id={`comment-input-${post.id}`}
                        type="text"
                        value={commentInputs[post.id] || ''}
                        onChange={(e) => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddComment(post.id);
                          }
                        }}
                        placeholder="একটি মন্তব্য লিখুন..."
                        className="flex-1 px-3 py-2 text-xs rounded-none border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-blue-900"
                      />
                      <button
                        id={`send-comment-btn-${post.id}`}
                        onClick={() => handleAddComment(post.id)}
                        disabled={!commentInputs[post.id]?.trim()}
                        className="p-2 bg-blue-900 text-white rounded-none hover:bg-blue-800 disabled:opacity-40 transition"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </article>
          );
        })}
      </div>

      {/* Delete Post Confirmation Modal */}
      {deletingPostId && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-none border border-slate-300 p-6 max-w-sm w-full space-y-4 shadow-xl">
            <div className="flex items-center gap-3 text-red-600">
              <Trash2 className="w-6 h-6 shrink-0" />
              <h3 className="text-base font-bold text-slate-900">পোস্ট মুছে ফেলার নিশ্চিতকরণ</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              আপনি কি নিশ্চিতভাবে আপনার এই পোস্টটি মুছে ফেলতে চান? মুছে ফেলার পর এটি আর ফেরত আনা যাবে না।
            </p>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                id="cancel-delete-post-btn"
                onClick={() => setDeletingPostId(null)}
                className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 border border-slate-200 transition cursor-pointer"
              >
                বাতিল করুন
              </button>
              <button
                id="confirm-delete-post-btn"
                onClick={() => {
                  deletePost(deletingPostId);
                  setDeletingPostId(null);
                }}
                className="px-4 py-2 text-xs font-bold bg-red-600 hover:bg-red-700 text-white transition shadow-xs cursor-pointer"
              >
                হ্যাঁ, মুছে ফেলুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
