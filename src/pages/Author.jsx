import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import AuthorBanner from "../images/author_banner.jpg";
import AuthorImage from "../images/author_thumbnail.jpg";
import AuthorItems from "../components/author/AuthorItems";

const BASE_URL =
  "https://us-central1-nft-cloud-functions.cloudfunctions.net/authors";

const Author = () => {
  const { authorId } = useParams();

  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // Follow state (UI-only for now)
  const [isFollowing, setIsFollowing] = useState(false);
  const [followers, setFollowers] = useState(0);

  const apiUrl = useMemo(() => {
    const id = encodeURIComponent(authorId || "");
    return `${BASE_URL}?author=${id}`;
  }, [authorId]);

  useEffect(() => {
    const controller = new AbortController();

    const fetchAuthor = async () => {
      try {
        setLoading(true);
        setErrorMsg("");
        setAuthor(null);

        const res = await axios.get(apiUrl, { signal: controller.signal });

        // API may return an object OR wrap in { data: ... } OR return an array
        const payload = res?.data;
        const data = Array.isArray(payload)
          ? payload[0]
          : payload?.data ?? payload;

        setAuthor(data || null);

        const initialFollowers =
          Number(data?.followers ?? data?.followerCount ?? data?.followersCount) ||
          0;
        setFollowers(initialFollowers);

        // If API exposes follow state, use it; otherwise default false
        setIsFollowing(Boolean(data?.isFollowing ?? data?.followed ?? false));
      } catch (err) {
        if (err?.name === "CanceledError" || err?.name === "AbortError") return;

        setErrorMsg(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to load author."
        );
      } finally {
        setLoading(false);
      }
    };

    if (authorId) fetchAuthor();

    return () => controller.abort();
  }, [apiUrl, authorId]);

  const handleToggleFollow = () => {
    setIsFollowing((prev) => {
      const next = !prev;
      setFollowers((f) => {
        const nextFollowers = next ? f + 1 : f - 1;
        return Math.max(0, nextFollowers);
      });
      return next;
    });
  };

 
  const display = useMemo(() => {
    const name = author?.authorName || author?.name || author?.username || "Author";
    const username =
      author?.username || author?.handle || author?.authorUsername || "";
    const wallet =
      author?.wallet ||
      author?.walletAddress ||
      author?.address ||
      author?.wallet_id ||
      "";

    const avatar =
      author?.authorImage ||
      author?.avatar ||
      author?.profileImage ||
      author?.image ||
      AuthorImage;

    const verified = Boolean(author?.verified ?? author?.isVerified);

    return { name, username, wallet, avatar, verified };
  }, [author]);

  if (!authorId) {
    return <div style={{ padding: 20 }}>Missing author id.</div>;
  }

  return (
    <div id="wrapper">
      <div className="no-bottom no-top" id="content">
        <div id="top"></div>

        <section
          id="profile_banner"
          aria-label="section"
          className="text-light"
          style={{ background: `url(${AuthorBanner}) top` }}
        ></section>

        <section aria-label="section">
          <div className="container">
            {loading && (
              <div className="row">
                <div className="col-md-12">
                  <div className="d_profile de-flex">
                    <div className="de-flex-col">
                      <div className="profile_avatar">
                        <div
                          style={{
                            width: 120,
                            height: 120,
                            borderRadius: "50%",
                            background: "#e9ecef",
                            display: "inline-block",
                            position: "relative",
                          }}
                        />
                        <div
                          style={{
                            width: 20,
                            height: 20,
                            borderRadius: "50%",
                            background: "#d1d5db",
                            position: "relative",
                            left: 90,
                            top: -25,
                          }}
                        />
                        <div style={{ marginTop: 12 }}>
                          <div
                            style={{
                              height: 16,
                              width: 220,
                              background: "#e9ecef",
                              borderRadius: 6,
                              marginBottom: 10,
                            }}
                          />
                          <div
                            style={{
                              height: 12,
                              width: 140,
                              background: "#e9ecef",
                              borderRadius: 6,
                              marginBottom: 10,
                            }}
                          />
                          <div
                            style={{
                              height: 12,
                              width: 360,
                              background: "#e9ecef",
                              borderRadius: 6,
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="profile_follow de-flex">
                      <div className="de-flex-col">
                        <div
                          style={{
                            height: 12,
                            width: 120,
                            background: "#e9ecef",
                            borderRadius: 6,
                            marginBottom: 12,
                          }}
                        />
                        <div
                          style={{
                            height: 40,
                            width: 140,
                            background: "#e9ecef",
                            borderRadius: 10,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-12" style={{ marginTop: 30 }}>
                  <div className="de_tab tab_simple">
                    <div className="row">
                      {new Array(8).fill(0).map((_, i) => (
                        <div className="col-lg-3 col-md-6 col-sm-6" key={i}>
                          <div
                            style={{
                              height: 220,
                              background: "#e9ecef",
                              borderRadius: 14,
                              marginBottom: 20,
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {!loading && errorMsg && (
              <div style={{ padding: "20px 0", color: "crimson" }}>
                {errorMsg}
              </div>
            )}

            {!loading && !errorMsg && author && (
              <div className="row">
                <div className="col-md-12">
                  <div className="d_profile de-flex">
                    <div className="de-flex-col">
                      <div className="profile_avatar">
                        <img
                          src={display.avatar}
                          alt={display.name}
                          onError={(e) => {
                            e.currentTarget.src = AuthorImage;
                          }}
                        />

                        {display.verified && <i className="fa fa-check"></i>}

                        <div className="profile_name">
                          <h4>
                            {display.name}
                            {display.username && (
                              <span className="profile_username">
                                @{display.username}
                              </span>
                            )}
                            {display.wallet && (
                              <span id="wallet" className="profile_wallet">
                                {display.wallet}
                              </span>
                            )}
                          </h4>
                        </div>
                      </div>
                    </div>

                    <div className="profile_follow de-flex">
                      <div className="de-flex-col">
                        <div className="profile_follower">
                          {followers} followers
                        </div>

                        <button
                          type="button"
                          className="btn-main"
                          onClick={handleToggleFollow}
                        >
                          {isFollowing ? "Unfollow" : "Follow"}
                        </button>

                        <div style={{ marginTop: 10, fontSize: 12, opacity: 0.7 }}>
                          Author ID: {authorId}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-12">
                  <div className="de_tab tab_simple">
                    <AuthorItems authorId={authorId} />
                  </div>
                </div>
              </div>
            )}

            {!loading && !errorMsg && !author && (
              <div style={{ padding: "20px 0" }}>
                Author not found for ID: <b>{authorId}</b>
                <div style={{ marginTop: 10 }}>
                  <Link to="/explore">Back to Explore</Link>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Author;
