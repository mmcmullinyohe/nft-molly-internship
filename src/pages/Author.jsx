import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AuthorBanner from "../images/author_banner.jpg";

const Author = () => {
  const { authorId } = useParams();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    const t = setTimeout(() => setLoading(false), 800);

    return () => clearTimeout(t);
  }, [authorId]);

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
            {}
            <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 10 }}>
              Author ID: {authorId}
            </div>

            {loading ? (
              <div className="row">
                <div className="col-md-12">
                  <div className="d_profile de-flex">
                    <div className="de-flex-col">
                      <div className="profile_avatar">
                        {}
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

                        {}
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

                        {}
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

                    {}
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

                {}
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
            ) : (
              <div style={{ padding: "20px 0" }}>
                <h3 style={{ marginBottom: 10 }}>Author Page</h3>
                <p style={{ opacity: 0.8, marginBottom: 0 }}>
                  Skeleton demo complete. Author ID in URL: <b>{authorId}</b>
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Author;
