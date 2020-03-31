curl -k -X POST \
    --header "Content-Type: application/x-www-form-urlencoded" \
    --header "Accept: application/json" \
    --data-urlencode "grant_type=urn:ibm:params:oauth:grant-type:apikey" \
    --data-urlencode "apikey=AZ5VvX71L-TKTgaZ5she_ItFKFfk5yo_8pkHm9k-FOCj" \
    "https://iam.bluemix.net/identity/token"