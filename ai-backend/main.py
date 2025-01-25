from fastapi import FastAPI, HTTPException
import ollama

app = FastAPI()

@app.get("/api/product")
async def get_product():
    try:
        response = ollama.chat(model='llama3.2', messages=[
            {
                'role': 'user',
                'content': '''
                    Generate JSON data for high-tech and futuristic products with the following details:
                    - name: A product name that sounds innovative and futuristic (e.g., AI smartphone, robotic assistant, or cutting-edge gadgets)
                    - description: A description highlighting the futuristic features (e.g., AI-powered, automated systems, IoT connectivity, or unique capabilities)
                    - categoryId: Product category (1 = Electronics, 2 = Audio, 3 = Gaming, 4 = TV, 5 = Camera, 6 = Drone)
                    - regularPrice: The standard price of the product in Thai Baht (e.g., 39900.00 THB)
                    - sale_price: The discounted or promotional price in Thai Baht (must be lower than the regular_price, e.g., 35900.00 THB)
                    - minimum_stock_level: The minimum quantity of the product that can be stored in inventory
                    - maximum_stock_level: The maximum quantity of the product that can be stored in inventory

                    Generate 1 product, ensuring each product represents cutting-edge technology, such as AI, AR/VR, robotics, or IoT systems.
                '''
                
            }
        ])

        response_text = response['message']['content']

        return { "response": response_text  }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))