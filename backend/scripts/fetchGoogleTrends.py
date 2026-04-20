import sys
import json
from pytrends.request import TrendReq

def fetch_trends(keyword):
    try:
        pytrends = TrendReq(hl='en-US', tz=360)
        pytrends.build_payload([keyword], timeframe='now 7-d')

        # Interest over time
        interest_df = pytrends.interest_over_time()

        if interest_df.empty:
            print(json.dumps({
                "keyword": keyword,
                "value": 0,
                "direction": "stable",
                "relatedQueries": []
            }))
            return

        # Latest value nikalo
        latest_value = int(interest_df[keyword].iloc[-1])

        # Value 0 hai toh related queries se estimate karo
        if latest_value == 0:
           related_interest = pytrends.interest_by_region()
        if not related_interest.empty:
           latest_value = int(related_interest[keyword].mean())

        # Direction calculate karo — upar ja raha hai ya neeche
        first_half = interest_df[keyword].iloc[:len(interest_df)//2].mean()
        second_half = interest_df[keyword].iloc[len(interest_df)//2:].mean()

        if second_half > first_half * 1.1:
            direction = "rising"
        elif second_half < first_half * 0.9:
            direction = "falling"
        else:
            direction = "stable"

        # Related queries nikalo
        related = pytrends.related_queries()
        related_list = []

        if keyword in related and related[keyword]['top'] is not None:
            top_queries = related[keyword]['top']
            related_list = top_queries['query'].head(5).tolist()

        result = {
            "keyword": keyword,
            "value": latest_value,
            "direction": direction,
            "relatedQueries": related_list
        }

        print(json.dumps(result))

    except Exception as e:
        print(json.dumps({
            "keyword": keyword,
            "value": 0,
            "direction": "stable",
            "relatedQueries": [],
            "error": str(e)
        }))

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No keyword provided"}))
        sys.exit(1)

    keyword = sys.argv[1]
    fetch_trends(keyword)