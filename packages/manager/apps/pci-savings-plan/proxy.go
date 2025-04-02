package main

import (
	"fmt"
	"io"
	"log"
	"net/http"
)

func main() {
	http.HandleFunc("/proxy", func(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Access-Control-Allow-Origin", "*")
    w.Header().Set("Access-Control-Allow-Headers", "*")
    w.Header().Set("Access-Control-Allow-Methods", "*")
		if r.Method == http.MethodOptions {
			return
		}

		// Récupération des paramètres projectId, year et month depuis la requête
		projectId := r.URL.Query().Get("projectId")
		year := r.URL.Query().Get("year")
		month := r.URL.Query().Get("month")

		// Construction de l'URL externe avec les paramètres récupérés
		externalURL := fmt.Sprintf("https://interne.ovh.net/uservice/gateway/rating/1.0/cloud/project/%s/usage/plans?year=%s&month=%s", projectId, year, month)
		req, err := http.NewRequest("GET", externalURL, nil)
		if err != nil {
			http.Error(w, "Failed to create request", http.StatusInternalServerError)
			return
		}

		req.Header.Set("Authorization", "Basic ZXJpYy5jaWNjb3R0aS5leHQ6RXprODlqVng5YlFrV1Q=")
		req.Header.Set("Accept", "application/json")

		client := &http.Client{}
		resp, err := client.Do(req)
		if err != nil {
			http.Error(w, "Failed to perform request", http.StatusInternalServerError)
			return
		}
		defer resp.Body.Close()

		for key, values := range resp.Header {
			for _, value := range values {
				w.Header().Add(key, value)
			}
		}

		w.WriteHeader(resp.StatusCode)

		_, err = io.Copy(w, resp.Body)
		if err != nil {
			log.Println("Failed to copy response body:", err)
		}
	})

	log.Println("Starting proxy server on :8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
