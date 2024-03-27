# Custom class to tell FastAPI how to encode MongoDB BSON _id into JSON
# https://www.mongodb.com/developer/languages/python/python-quickstart-fastapi/

from typing_extensions import Annotated
from pydantic.functional_validators import BeforeValidator


PyObjectId = Annotated[str, BeforeValidator(str)]
