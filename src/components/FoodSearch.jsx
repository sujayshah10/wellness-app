import { useState, useEffect } from "react";
import "./FoodSearch.css";

export default function FoodSearch({ onSelect, manualEntryFallback }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showManual, setShowManual] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.length >= 2) {
        searchFood(query);
      } else {
        setResults([]);
        setError(null);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const searchFood = async (searchQuery) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(searchQuery)}&json=1&page_size=10`
      );
      const data = await response.json();
      
      if (data.products && data.products.length > 0) {
        const processedResults = data.products
          .filter(product => product.nutriments && product.product_name)
          .map(product => ({
            id: product.code,
            name: product.product_name,
            brand: product.brands || "",
            calories: product.nutriments["energy-kcal_100g"] || product.nutriments["energy-kcal"] || 0,
            protein: product.nutriments.proteins_100g || 0,
            carbs: product.nutriments.carbohydrates_100g || 0,
            fat: product.nutriments.fat_100g || 0,
            servingSize: product.serving_size || "100g",
            image: product.image_front_small_url || null
          }));
        
        setResults(processedResults);
      } else {
        setResults([]);
      }
    } catch (err) {
      setError("Failed to search. Please try manual entry.");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (result) => {
    const mealData = {
      name: result.name,
      calories: Math.round(result.calories),
      protein: Math.round(result.protein),
      carbs: Math.round(result.carbs),
      fat: Math.round(result.fat)
    };
    onSelect(mealData);
    setQuery("");
    setResults([]);
  };

  const handleManualEntry = () => {
    setShowManual(true);
    onSelect(null); // Signal that manual entry is needed
  };

  return (
    <div className="food-search">
      <div className="food-search-input-wrapper">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for food (e.g., 'chicken breast', 'dal', 'rice')..."
          className="food-search-input"
          autoFocus
        />
        <button
          type="button"
          onClick={handleManualEntry}
          className="food-search-manual-btn"
          title="Enter manually"
        >
          ✏️
        </button>
      </div>

      {loading && (
        <div className="food-search-loading">
          Searching...
        </div>
      )}

      {error && (
        <div className="food-search-error">
          {error}
          <button 
            type="button" 
            onClick={handleManualEntry}
            className="food-search-manual-link"
          >
            Enter manually instead
          </button>
        </div>
      )}

      {!loading && !error && query.length >= 2 && results.length === 0 && (
        <div className="food-search-no-results">
          No results found. 
          <button 
            type="button" 
            onClick={handleManualEntry}
            className="food-search-manual-link"
          >
            Enter manually instead
          </button>
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className="food-search-results">
          {results.map((result) => (
            <div
              key={result.id}
              onClick={() => handleSelect(result)}
              className="food-search-result"
            >
              <div className="food-result-info">
                <div className="food-result-name">{result.name}</div>
                {result.brand && (
                  <div className="food-result-brand">{result.brand}</div>
                )}
                <div className="food-result-serving">Per {result.servingSize}</div>
              </div>
              <div className="food-result-nutrition">
                <div className="nutrition-item">
                  <span className="nutrition-label">Cal:</span>
                  <span className="nutrition-value">{Math.round(result.calories)}</span>
                </div>
                <div className="nutrition-item">
                  <span className="nutrition-label">Pro:</span>
                  <span className="nutrition-value">{Math.round(result.protein)}g</span>
                </div>
                <div className="nutrition-item">
                  <span className="nutrition-label">Carb:</span>
                  <span className="nutrition-value">{Math.round(result.carbs)}g</span>
                </div>
                <div className="nutrition-item">
                  <span className="nutrition-label">Fat:</span>
                  <span className="nutrition-value">{Math.round(result.fat)}g</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {query.length === 0 && (
        <div className="food-search-hint">
          <div className="food-search-hint-title">💡 Tips for better results:</div>
          <ul className="food-search-hint-list">
            <li>Try specific foods: "chicken breast", "brown rice", "eggs"</li>
            <li>For Indian dishes: "dal", "chicken curry", "paneer"</li>
            <li>Common brands work better than generic terms</li>
            <li>Use English names for best results</li>
          </ul>
          <button 
            type="button" 
            onClick={handleManualEntry}
            className="food-search-manual-link"
          >
            Or enter manually
          </button>
        </div>
      )}
    </div>
  );
}
