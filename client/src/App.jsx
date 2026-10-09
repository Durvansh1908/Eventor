import { useMemo, useState } from "react";
import "./App.css";

const listings = [
  {
    id: 1,
    category: "Stays",
    title: "The Orchid Grand",
    location: "Mumbai, Maharashtra",
    description: "Premium stay with breakfast and city views",
    price: 6500,
    unit: "night",
    rating: 4.91,
    reviews: 248,
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=85",
    tag: "Guest favourite",
    details: ["Breakfast available", "Swimming pool", "Free Wi-Fi"],
  },
  {
    id: 2,
    category: "Stays",
    title: "Serene Valley Resort",
    location: "Lonavala, Maharashtra",
    description: "A peaceful mountain getaway",
    price: 4800,
    unit: "night",
    rating: 4.86,
    reviews: 176,
    image:
      "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=1000&q=85",
    tag: "Popular",
    details: ["Mountain views", "Restaurant", "Parking"],
  },
  {
    id: 3,
    category: "Stays",
    title: "The Royal Palm Suites",
    location: "Goa, India",
    description: "Modern suites close to the beach",
    price: 7200,
    unit: "night",
    rating: 4.95,
    reviews: 321,
    image:
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1000&q=85",
    tag: "Rare find",
    details: ["Beach access", "Pool", "Air conditioning"],
  },
  {
    id: 4,
    category: "Pilgrimage",
    title: "Tirupati Darshan Journey",
    location: "Tirumala, Andhra Pradesh",
    description: "Travel assistance, hotel options and darshan planning",
    price: 2499,
    unit: "person",
    rating: 4.88,
    reviews: 194,
    image:
      "https://images.unsplash.com/photo-1606293926075-69a00dbfde81?auto=format&fit=crop&w=1000&q=85",
    tag: "Pilgrim favourite",
    details: ["Journey assistance", "Hotel options", "Travel planning"],
    vipPrice: 5000,
    vipLabel: "VIP / Special Entry (illustrative)",
    tiers: [
      { label: "Standard package", price: 2499 },
      { label: "Premium package", price: 3999 },
      { label: "VIP / Special Entry estimate", price: 5000 },
    ],
  },
  {
    id: 5,
    category: "Pilgrimage",
    title: "Shirdi Sai Baba Yatra",
    location: "Shirdi, Maharashtra",
    description: "A devotional trip with transport and stay options",
    price: 1799,
    unit: "person",
    rating: 4.84,
    reviews: 156,
    image:
      "https://images.unsplash.com/photo-1604608672516-8c3c9a9f6c50?auto=format&fit=crop&w=1000&q=85",
    tag: "Weekend trip",
    details: ["Transport options", "Hotel assistance", "Trip itinerary"],
    vipPrice: 2999,
    vipLabel: "Premium darshan package (illustrative)",
    tiers: [
      { label: "Standard package", price: 1799 },
      { label: "Premium package", price: 2999 },
    ],
  },
  {
    id: 6,
    category: "Pilgrimage",
    title: "Kashi Spiritual Escape",
    location: "Varanasi, Uttar Pradesh",
    description: "Explore sacred ghats, temples and local culture",
    price: 3299,
    unit: "person",
    rating: 4.9,
    reviews: 203,
    image:
      "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1000&q=85",
    tag: "Cultural journey",
    details: ["Guided city tour", "Hotel options", "Local transport"],
    vipPrice: 4499,
    vipLabel: "Premium experience (illustrative)",
    tiers: [
      { label: "Standard package", price: 3299 },
      { label: "Premium experience", price: 4499 },
    ],
  },
  {
    id: 7,
    category: "Corporate",
    title: "The Grand Summit Convention Hall",
    location: "Bandra Kurla Complex, Mumbai",
    description: "A sophisticated venue for conferences and launches",
    price: 85000,
    unit: "event",
    rating: 4.92,
    reviews: 87,
    image:
      "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1000&q=85",
    tag: "Corporate favourite",
    details: ["Up to 500 guests", "AV equipment", "Catering options"],
    capacity: "100–500 guests",
  },
  {
    id: 8,
    category: "Corporate",
    title: "Skyline Business Centre",
    location: "Lower Parel, Mumbai",
    description: "Flexible meeting rooms and executive event spaces",
    price: 18000,
    unit: "event",
    rating: 4.81,
    reviews: 64,
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1000&q=85",
    tag: "Business meetings",
    details: ["Up to 80 guests", "Presentation screen", "Refreshments"],
    capacity: "10–80 guests",
  },
  {
    id: 9,
    category: "Corporate",
    title: "Lakeside Celebration Estate",
    location: "Powai, Mumbai",
    description: "An elegant space for team celebrations and retreats",
    price: 55000,
    unit: "event",
    rating: 4.87,
    reviews: 72,
    image:
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1000&q=85",
    tag: "Special occasions",
    details: ["Up to 250 guests", "Outdoor space", "Catering options"],
    capacity: "50–250 guests",
  },
  {
    id: 10,
    category: "Concerts",
    title: "Neon Nights Live",
    location: "Mahalaxmi Grounds, Mumbai",
    description: "A high-energy live music festival",
    price: 1499,
    unit: "ticket",
    rating: 4.89,
    reviews: 432,
    image:
      "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=1000&q=85",
    tag: "Popular event",
    dateLabel: "Sample event · Check official schedule",
    ticketTypes: [
      { label: "General admission", price: 1499 },
      { label: "Premium", price: 2999 },
      { label: "VIP", price: 5999 },
    ],
  },
  {
    id: 11,
    category: "Concerts",
    title: "Echoes Music Experience",
    location: "NESCO Centre, Mumbai",
    description: "An immersive evening of music and entertainment",
    price: 999,
    unit: "ticket",
    rating: 4.82,
    reviews: 286,
    image:
      "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1000&q=85",
    tag: "Live music",
    dateLabel: "Sample event · Check official schedule",
    ticketTypes: [
      { label: "General admission", price: 999 },
      { label: "Premium", price: 2499 },
      { label: "VIP", price: 4499 },
    ],
  },
  {
    id: 12,
    category: "Concerts",
    title: "The Soundwave Arena",
    location: "Pune, Maharashtra",
    description: "A live performance experience for music fans",
    price: 1299,
    unit: "ticket",
    rating: 4.85,
    reviews: 198,
    image:
      "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=1000&q=85",
    tag: "Worth experiencing",
    dateLabel: "Sample event · Check official schedule",
    ticketTypes: [
      { label: "General admission", price: 1299 },
      { label: "Premium", price: 2799 },
      { label: "VIP", price: 4999 },
    ],
  },
];

const categories = [
  { name: "All", icon: "✦" },
  { name: "Stays", icon: "⌂" },
  { name: "Pilgrimage", icon: "ॐ" },
  { name: "Corporate", icon: "▦" },
  { name: "Concerts", icon: "♫" },
];

const money = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

const today = () => new Date().toISOString().slice(0, 10);

function App() {
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);
  const [maxPrice, setMaxPrice] = useState(100000);
  const [sort, setSort] = useState("recommended");
  const [selected, setSelected] = useState(null);
  const [favourites, setFavourites] = useState([]);
  const [showFavourites, setShowFavourites] = useState(false);
  const [booking, setBooking] = useState(null);
  const [bookingDate, setBookingDate] = useState("");
  const [bookingName, setBookingName] = useState("");
  const [bookingEmail, setBookingEmail] = useState("");
  const [bookingPhone, setBookingPhone] = useState("");
  const [bookingGuests, setBookingGuests] = useState(2);
  const [bookingTier, setBookingTier] = useState("");
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [notice, setNotice] = useState("");

  const filteredListings = useMemo(() => {
    let result = listings.filter((item) => {
      const matchesCategory =
        category === "All" || item.category === category;

      const query = `${item.title} ${item.location} ${item.description}`
        .toLowerCase();
      const matchesSearch = query.includes(search.toLowerCase().trim());
      const matchesLocation = item.location
        .toLowerCase()
        .includes(location.toLowerCase().trim());
      const matchesPrice = item.price <= maxPrice;
      const matchesFavourite =
        !showFavourites || favourites.includes(item.id);

      return (
        matchesCategory &&
        matchesSearch &&
        matchesLocation &&
        matchesPrice &&
        matchesFavourite
      );
    });

    if (sort === "price-low") result.sort((a, b) => a.price - b.price);
    if (sort === "price-high") result.sort((a, b) => b.price - a.price);
    if (sort === "rating") result.sort((a, b) => b.rating - a.rating);

    return result;
  }, [category, search, location, maxPrice, sort, showFavourites, favourites]);

  const openBooking = (item) => {
    setSelected(null);
    setBooking(item);
    setBookingDate(
      item.category === "Stays" ? checkIn : ""
    );
    setBookingGuests(guests);
    setBookingTier(
      item.ticketTypes?.[0]?.label ||
        item.tiers?.[0]?.label ||
        ""
    );
    setBookingConfirmed(false);
    setBookingName("");
    setBookingEmail("");
    setBookingPhone("");
    setNotice("");
  };

  const closeBooking = () => {
    setBooking(null);
    setBookingConfirmed(false);
    setNotice("");
  };

  const getSelectedPrice = () => {
    if (!booking) return 0;
    const options = booking.ticketTypes || booking.tiers || [];
    const selectedOption = options.find(
      (option) => option.label === bookingTier
    );
    return selectedOption?.price ?? booking.price;
  };

  const getNights = () => {
    if (!checkIn || !checkOut) return 1;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const days = Math.ceil((end - start) / 86400000);
    return Math.max(1, days);
  };

  const getTotal = () => {
    if (!booking) return 0;
    const unitPrice = getSelectedPrice();

    if (booking.category === "Stays") {
      return unitPrice * getNights();
    }

    return unitPrice * Math.max(1, Number(bookingGuests));
  };

  const submitBooking = (event) => {
    event.preventDefault();

    if (!bookingName.trim() || !bookingEmail.trim() || !bookingDate) {
      setNotice("Please complete your name, email and date.");
      return;
    }

    if (
      booking.category === "Stays" &&
      (!checkIn || !checkOut || checkOut <= checkIn)
    ) {
      setNotice("Please select a valid check-in and check-out date.");
      return;
    }

    const confirmation = {
      reference: `EVT-${Date.now().toString().slice(-8)}`,
      item: booking.title,
      category: booking.category,
      date: bookingDate,
      name: bookingName,
      email: bookingEmail,
      phone: bookingPhone,
      guests: bookingGuests,
      option: bookingTier || "Standard",
      total: getTotal(),
      status: "Demo confirmation — not a real reservation",
    };

    const previous = JSON.parse(
      window.localStorage.getItem("eventer-demo-bookings") || "[]"
    );
    window.localStorage.setItem(
      "eventer-demo-bookings",
      JSON.stringify([confirmation, ...previous])
    );

    setBookingConfirmed(true);
    setNotice("");
  };

  const toggleFavourite = (id) => {
    setFavourites((current) =>
      current.includes(id)
        ? current.filter((favouriteId) => favouriteId !== id)
        : [...current, id]
    );
  };

  const scrollToListings = () => {
    document.getElementById("listings")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  const handleSearch = (event) => {
    event.preventDefault();
    setShowFavourites(false);
    scrollToListings();
  };

  return (
    <div className="eventer">
      <header className="topbar">
        <a
          className="brand"
          href="#home"
          onClick={() => {
            setCategory("All");
            setShowFavourites(false);
          }}
        >
          <span className="brand-symbol">e</span>
          <span>eventer</span>
        </a>

        <nav className="top-links" aria-label="Main navigation">
          <button
            className={category === "All" ? "top-link active" : "top-link"}
            onClick={() => {
              setCategory("All");
              setShowFavourites(false);
            }}
          >
            Explore
          </button>
          <button
            className={category === "Corporate" ? "top-link active" : "top-link"}
            onClick={() => {
              setCategory("Corporate");
              setShowFavourites(false);
              scrollToListings();
            }}
          >
            Corporate events
          </button>
          <button
            className={category === "Pilgrimage" ? "top-link active" : "top-link"}
            onClick={() => {
              setCategory("Pilgrimage");
              setShowFavourites(false);
              scrollToListings();
            }}
          >
            Pilgrimage
          </button>
        </nav>

        <div className="top-actions">
          <button
            className="host-link"
            onClick={() =>
              window.alert(
                "Venue partner registration can be connected to your backend."
              )
            }
          >
            List your venue
          </button>
          <button
            className="profile-button"
            aria-label="Show saved favourites"
            title="Saved favourites"
            onClick={() => {
              setShowFavourites((current) => !current);
              setCategory("All");
              scrollToListings();
            }}
          >
            <span>♡</span>
            <span className="profile-avatar">☰</span>
          </button>
        </div>
      </header>

      <main id="home">
        <section className="hero">
          <div className="hero-content">
            <span className="eyebrow">YOUR NEXT EXPERIENCE STARTS HERE</span>
            <h1>
              Make plans.
              <br />
              Make <span>memories.</span>
            </h1>
            <p>
              Find exceptional stays, spiritual journeys, business venues
              and live events — all in one place.
            </p>

            <div className="hero-pills">
              <span>✦ Handpicked experiences</span>
              <span>⌕ Easy discovery</span>
              <span>♡ Save your favourites</span>
            </div>
          </div>

          <div className="hero-image">
            <img
              src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1500&q=90"
              alt="Elegant event venue set up for a special occasion"
            />
            <div className="floating-note">
              <span className="note-icon">✦</span>
              <div>
                <strong>One platform. Every plan.</strong>
                <span>Stay, celebrate, explore.</span>
              </div>
            </div>
          </div>
        </section>

        <section className="search-panel" aria-label="Search bookings">
          <form className="search-form" onSubmit={handleSearch}>
            <label className="search-field destination-field">
              <span className="field-label">WHERE TO?</span>
              <input
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                placeholder="City or destination"
              />
            </label>

            <label className="search-field">
              <span className="field-label">CHECK IN / DATE</span>
              <input
                type="date"
                min={today()}
                value={checkIn}
                onChange={(event) => {
                  setCheckIn(event.target.value);
                  if (checkOut && event.target.value >= checkOut) {
                    setCheckOut("");
                  }
                }}
              />
            </label>

            <label className="search-field">
              <span className="field-label">CHECK OUT</span>
              <input
                type="date"
                min={checkIn || today()}
                value={checkOut}
                onChange={(event) => setCheckOut(event.target.value)}
              />
            </label>

            <label className="search-field guests-field">
              <span className="field-label">GUESTS / TICKETS</span>
              <select
                value={guests}
                onChange={(event) => setGuests(Number(event.target.value))}
              >
                {[1, 2, 3, 4, 5, 6, 8, 10, 20, 50, 100].map((number) => (
                  <option key={number} value={number}>
                    {number} {number === 1 ? "person" : "people"}
                  </option>
                ))}
              </select>
            </label>

            <button className="search-submit" type="submit" aria-label="Search">
              <span>⌕</span>
              <span className="search-button-text">Search</span>
            </button>
          </form>
        </section>

        <section className="categories-section">
          <div className="category-list" aria-label="Browse categories">
            {categories.map((item) => (
              <button
                key={item.name}
                className={
                  category === item.name && !showFavourites
                    ? "category-button selected"
                    : "category-button"
                }
                onClick={() => {
                  setCategory(item.name);
                  setShowFavourites(false);
                  scrollToListings();
                }}
              >
                <span className="category-icon">{item.icon}</span>
                <span>{item.name}</span>
              </button>
            ))}
            <button
              className={
                showFavourites
                  ? "category-button selected"
                  : "category-button"
              }
              onClick={() => {
                setShowFavourites((current) => !current);
                setCategory("All");
              }}
            >
              <span className="category-icon">♡</span>
              <span>Wishlists</span>
            </button>
          </div>
        </section>

        <section className="listing-section" id="listings">
          <div className="section-heading">
            <div>
              <span className="eyebrow">
                {showFavourites ? "YOUR COLLECTION" : "EXPLORE EVENTER"}
              </span>
              <h2>
                {showFavourites
                  ? "Your saved places"
                  : category === "All"
                    ? "Discover your next experience"
                    : category === "Stays"
                      ? "Stays worth travelling for"
                      : category === "Pilgrimage"
                        ? "Journeys with meaning"
                        : category === "Corporate"
                          ? "Spaces for great ideas"
                          : "Feel the live experience"}
              </h2>
              <p>
                {showFavourites
                  ? "Your favourite listings, all in one place."
                  : "Explore handpicked options for every kind of occasion."}
              </p>
            </div>

            <div className="listing-controls">
              <label className="filter-search">
                <span>⌕</span>
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search listings"
                  aria-label="Search listings"
                />
              </label>
              <label className="sort-control">
                <span>Sort</span>
                <select
                  value={sort}
                  onChange={(event) => setSort(event.target.value)}
                  aria-label="Sort listings"
                >
                  <option value="recommended">Recommended</option>
                  <option value="price-low">Price: low to high</option>
                  <option value="price-high">Price: high to low</option>
                  <option value="rating">Top rated</option>
                </select>
              </label>
            </div>
          </div>

          <div className="filter-row">
            <label className="price-filter">
              <span>Maximum starting price</span>
              <strong>{money(maxPrice)}</strong>
              <input
                type="range"
                min="1000"
                max="100000"
                step="1000"
                value={maxPrice}
                onChange={(event) => setMaxPrice(Number(event.target.value))}
              />
            </label>
            <span className="result-count">
              {filteredListings.length} experiences
            </span>
          </div>

          {filteredListings.length > 0 ? (
            <div className="listing-grid">
              {filteredListings.map((item) => (
                <article className="listing-card" key={item.id}>
                  <button
                    className="card-image-button"
                    onClick={() => setSelected(item)}
                    aria-label={`View ${item.title}`}
                  >
                    <img src={item.image} alt={item.title} loading="lazy" />
                    <span className="card-tag">{item.tag}</span>
                  </button>

                  <button
                    className={
                      favourites.includes(item.id)
                        ? "favourite-button is-favourite"
                        : "favourite-button"
                    }
                    onClick={() => toggleFavourite(item.id)}
                    aria-label={
                      favourites.includes(item.id)
                        ? "Remove from favourites"
                        : "Add to favourites"
                    }
                    title="Save to favourites"
                  >
                    {favourites.includes(item.id) ? "♥" : "♡"}
                  </button>

                  <button
                    className="listing-info"
                    onClick={() => setSelected(item)}
                  >
                    <div className="listing-title-row">
                      <h3>{item.title}</h3>
                      <span className="rating">★ {item.rating}</span>
                    </div>
                    <p className="listing-location">{item.location}</p>
                    <p className="listing-description">{item.description}</p>

                    {item.capacity && (
                      <p className="listing-extra">{item.capacity}</p>
                    )}
                    {item.dateLabel && (
                      <p className="listing-extra">{item.dateLabel}</p>
                    )}

                    <p className="listing-price">
                      <strong>{money(item.price)}</strong>
                      <span> / {item.unit}</span>
                    </p>
                    <span className="view-details">View details ↗</span>
                  </button>

                  <button
                    className="card-book-button"
                    onClick={() => openBooking(item)}
                  >
                    Book now
                  </button>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <span>⌕</span>
              <h3>No experiences found</h3>
              <p>Try another category, location, or maximum price.</p>
              <button
                className="primary-button"
                onClick={() => {
                  setCategory("All");
                  setSearch("");
                  setLocation("");
                  setMaxPrice(100000);
                  setShowFavourites(false);
                }}
              >
                Clear filters
              </button>
            </div>
          )}
        </section>

        <section className="host-banner">
          <div>
            <span className="eyebrow">FOR VENUE PARTNERS</span>
            <h2>Your space could be someone's next big moment.</h2>
            <p>
              Bring your hotel, event venue or experience to the Eventer
              marketplace.
            </p>
          </div>
          <button
            className="host-banner-button"
            onClick={() =>
              window.alert(
                "Partner registration is a demo. Connect this action to your venue registration API."
              )
            }
          >
            Become a partner <span>↗</span>
          </button>
        </section>
      </main>

      <footer className="footer">
        <a className="brand footer-brand" href="#home">
          <span className="brand-symbol">e</span>
          <span>eventer</span>
        </a>
        <p>Find your place. Plan your moment. Make it memorable.</p>
        <span>© {new Date().getFullYear()} Eventer · Demo marketplace</span>
      </footer>

      {selected && (
        <div className="modal-backdrop" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setSelected(null);
        }}>
          <section className="details-modal" role="dialog" aria-modal="true" aria-label={selected.title}>
            <button
              className="modal-close"
              onClick={() => setSelected(null)}
              aria-label="Close details"
            >
              ×
            </button>
            <img className="details-image" src={selected.image} alt={selected.title} />
            <div className="details-content">
              <span className="eyebrow">{selected.category}</span>
              <h2>{selected.title}</h2>
              <p className="details-location">{selected.location} · ★ {selected.rating} ({selected.reviews} reviews)</p>
              <p>{selected.description}</p>

              {selected.dateLabel && (
                <p className="details-note">{selected.dateLabel}</p>
              )}

              {selected.category === "Pilgrimage" && (
                <div className="important-note">
                  Darshan slots, eligibility, and official charges must be
                  confirmed through the temple's official booking channel.
                  Prices shown here are illustrative package estimates.
                </div>
              )}

              <h3>What is included</h3>
              <div className="amenity-list">
                {selected.details.map((detail) => (
                  <span key={detail}>✓ {detail}</span>
                ))}
              </div>

              {(selected.ticketTypes || selected.tiers) && (
                <div className="package-list">
                  {(selected.ticketTypes || selected.tiers).map((option) => (
                    <div className="package-option" key={option.label}>
                      <span>{option.label}</span>
                      <strong>{money(option.price)}</strong>
                    </div>
                  ))}
                </div>
              )}

              <div className="details-bottom">
                <p><strong>{money(selected.price)}</strong> / {selected.unit}</p>
                <button className="primary-button" onClick={() => openBooking(selected)}>
                  Continue to booking
                </button>
              </div>
            </div>
          </section>
        </div>
      )}

      {booking && (
        <div className="modal-backdrop" onMouseDown={(event) => {
          if (event.target === event.currentTarget) closeBooking();
        }}>
          <section className="booking-modal" role="dialog" aria-modal="true" aria-label="Booking form">
            <button
              className="modal-close"
              onClick={closeBooking}
              aria-label="Close booking"
            >
              ×
            </button>

            {bookingConfirmed ? (
              <div className="confirmation">
                <span className="confirmation-icon">✓</span>
                <span className="eyebrow">DEMO BOOKING CREATED</span>
                <h2>You're one step closer.</h2>
                <p className="confirmation-copy">
                  Your demo booking for <strong>{booking.title}</strong> has
                  been saved in this browser.
                </p>
                <div className="confirmation-card">
                  <div><span>Reference</span><strong>EVT-{Date.now().toString().slice(-8)}</strong></div>
                  <div><span>Experience</span><strong>{booking.title}</strong></div>
                  <div><span>Date</span><strong>{bookingDate}</strong></div>
                  <div><span>Guests / tickets</span><strong>{bookingGuests}</strong></div>
                  <div><span>Package</span><strong>{bookingTier || "Standard"}</strong></div>
                  <div><span>Estimated total</span><strong>{money(getTotal())}</strong></div>
                </div>
                <p className="demo-warning">
                  This is not a confirmed hotel reservation, issued ticket,
                  temple darshan slot, or payment receipt.
                </p>
                <button className="primary-button full-button" onClick={closeBooking}>
                  Back to Eventer
                </button>
              </div>
            ) : (
              <>
                <div className="booking-heading">
                  <span className="eyebrow">YOUR NEXT EXPERIENCE</span>
                  <h2>Complete your booking</h2>
                  <p>Enter your details to create a demo booking.</p>
                </div>

                <div className="booking-item">
                  <img src={booking.image} alt="" />
                  <div>
                    <strong>{booking.title}</strong>
                    <span>{booking.location}</span>
                    <span>{money(booking.price)} / {booking.unit}</span>
                  </div>
                </div>

                <form className="booking-form" onSubmit={submitBooking}>
                  <div className="form-grid">
                    <label>
                      Full name *
                      <input
                        required
                        value={bookingName}
                        onChange={(event) => setBookingName(event.target.value)}
                        placeholder="Your full name"
                      />
                    </label>
                    <label>
                      Email address *
                      <input
                        required
                        type="email"
                        value={bookingEmail}
                        onChange={(event) => setBookingEmail(event.target.value)}
                        placeholder="you@example.com"
                      />
                    </label>
                    <label>
                      Phone number
                      <input
                        type="tel"
                        value={bookingPhone}
                        onChange={(event) => setBookingPhone(event.target.value)}
                        placeholder="Phone number"
                      />
                    </label>
                    <label>
                      {booking.category === "Stays" ? "Check-in date *" : "Event / journey date *"}
                      <input
                        required
                        type="date"
                        min={today()}
                        value={bookingDate}
                        onChange={(event) => {
                          setBookingDate(event.target.value);
                          if (booking.category === "Stays") {
                            setCheckIn(event.target.value);
                          }
                        }}
                      />
                    </label>

                    {booking.category === "Stays" && (
                      <label>
                        Check-out date *
                        <input
                          required
                          type="date"
                          min={bookingDate || today()}
                          value={checkOut}
                          onChange={(event) => setCheckOut(event.target.value)}
                        />
                      </label>
                    )}

                    <label>
                      {booking.category === "Corporate" ? "Attendees" : "Guests / tickets"}
                      <select
                        value={bookingGuests}
                        onChange={(event) => setBookingGuests(Number(event.target.value))}
                      >
                        {[1, 2, 3, 4, 5, 10, 20, 50, 100, 250, 500].map((number) => (
                          <option key={number} value={number}>{number}</option>
                        ))}
                      </select>
                    </label>
                  </div>

                  {(booking.ticketTypes || booking.tiers) && (
                    <label className="package-select">
                      Select ticket / package
                      <select
                        value={bookingTier}
                        onChange={(event) => setBookingTier(event.target.value)}
                      >
                        {(booking.ticketTypes || booking.tiers).map((option) => (
                          <option key={option.label} value={option.label}>
                            {option.label} — {money(option.price)}
                          </option>
                        ))}
                      </select>
                    </label>
                  )}

                  {booking.category === "Pilgrimage" && (
                    <p className="important-note">
                      VIP / special-entry darshan is subject to official
                      eligibility, slot availability and rules. This demo
                      cannot reserve or guarantee darshan.
                    </p>
                  )}

                  {booking.category === "Corporate" && (
                    <p className="important-note">
                      Venue pricing is a sample starting estimate. Final quotes
                      depend on capacity, duration, catering and equipment.
                    </p>
                  )}

                  {booking.category === "Concerts" && (
                    <p className="important-note">
                      Sample event and ticket details only. Verify the official
                      organizer, schedule, and ticket inventory before purchase.
                    </p>
                  )}

                  {booking.category === "Stays" && (
                    <p className="important-note">
                      Select valid check-in and check-out dates. The displayed
                      total uses the sample nightly rate.
                    </p>
                  )}

                  <div className="price-summary">
                    <div>
                      <span>Rate</span>
                      <strong>{money(getSelectedPrice())}</strong>
                    </div>
                    {booking.category === "Stays" && (
                      <div>
                        <span>Nights</span>
                        <strong>{getNights()}</strong>
                      </div>
                    )}
                    <div className="total-row">
                      <span>Estimated total</span>
                      <strong>{money(getTotal())}</strong>
                    </div>
                  </div>

                  {notice && <p className="form-error">{notice}</p>}

                  <button className="primary-button full-button" type="submit">
                    Create demo booking · {money(getTotal())}
                  </button>
                  <p className="secure-note">
                    No payment will be taken. This prototype stores demo
                    bookings in your current browser only.
                  </p>
                </form>
              </>
            )}
          </section>
        </div>
      )}
    </div>
  );
}

export default App;