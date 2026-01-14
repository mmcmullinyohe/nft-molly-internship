import React, { useEffect, useState } from "react";
import axios from "axios";
import SubHeader from "../images/subheader.jpg";
import ExploreItems from "../components/explore/ExploreItems";

const API_URL =
  "https://us-central1-nft-cloud-functions.cloudfunctions.net/explore";

const Explore = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [filter, setFilter] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);

    const controller = new AbortController();

    const fetchExplore = async () => {
      try {
        setLoading(true);
        setErrorMsg("");

        const res = await axios.get(API_URL, { signal: controller.signal });

        const payload = res?.data;
        const list = Array.isArray(payload) ? payload : payload?.data || [];

        setItems(Array.isArray(list) ? list : []);
      } catch (err) {
        if (err?.name === "CanceledError" || err?.name === "AbortError") return;

        setErrorMsg(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to load explore items."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchExplore();

    return () => controller.abort();
  }, []);

  return (
    <div id="wrapper">
      <div className="no-bottom no-top" id="content">
        <div id="top"></div>

        <section
          id="subheader"
          className="text-light"
          style={{ background: `url(${SubHeader}) top` }}
        >
          <div className="center-y relative text-center">
            <div className="container">
              <div className="row">
                <div className="col-md-12 text-center">
                  <h1>Explore</h1>

                  {loading && (
                    <div style={{ marginTop: 10, fontSize: 14, opacity: 0.85 }}>
                      Loading items…
                    </div>
                  )}

                  {!loading && errorMsg && (
                    <div style={{ marginTop: 10, fontSize: 14, color: "crimson" }}>
                      {errorMsg}
                    </div>
                  )}
                </div>

                <div className="clearfix"></div>
              </div>
            </div>
          </div>
        </section>

        <section aria-label="section">
          <div className="container">
            <div className="row">
              <ExploreItems
                items={items}
                loading={loading}
                filter={filter}
                onFilterChange={setFilter}
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Explore;
