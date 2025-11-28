#!/bin/bash

# Test script for Venue Booking API

BASE_URL="http://localhost:3000"

echo "======================================"
echo "Venue Booking API Test Script"
echo "======================================"
echo ""

# Test 1: Health check
echo "1. Testing health endpoint..."
curl -s "$BASE_URL/health" | jq '.'
echo ""

# Test 2: Get all venues
echo "2. Testing GET /api/venues (all venues)..."
curl -s "$BASE_URL/api/venues?limit=2" | jq '.pagination'
echo ""

# Test 3: Filter by location
echo "3. Testing GET /api/venues (filter by location: Denver)..."
curl -s "$BASE_URL/api/venues?location=Denver" | jq '.data[0] | {name, location, capacity, pricePerNight}'
echo ""

# Test 4: Filter by capacity and price
echo "4. Testing GET /api/venues (filter by minCapacity=40, maxPricePerNight=3000)..."
curl -s "$BASE_URL/api/venues?minCapacity=40&maxPricePerNight=3000" | jq '.data[] | {name, capacity, pricePerNight}'
echo ""

# Test 5: Pagination
echo "5. Testing pagination (page=1, limit=3)..."
curl -s "$BASE_URL/api/venues?page=1&limit=3" | jq '.pagination'
echo ""

# Get a venue ID for booking tests
VENUE_ID=$(curl -s "$BASE_URL/api/venues?limit=1" | jq -r '.data[0].id')
echo "Using venue ID: $VENUE_ID"
echo ""

# Test 6: Create a booking
echo "6. Testing POST /api/bookings (valid booking)..."
curl -s -X POST "$BASE_URL/api/bookings" \
  -H "Content-Type: application/json" \
  -d "{
    \"venueId\": \"$VENUE_ID\",
    \"companyName\": \"Test Company\",
    \"email\": \"test@example.com\",
    \"startDate\": \"2024-12-20T00:00:00.000Z\",
    \"endDate\": \"2024-12-25T00:00:00.000Z\",
    \"attendeeCount\": 20
  }" | jq '{message, data: {companyName: .data.companyName, status: .data.status}}'
echo ""

# Test 7: Test capacity validation
echo "7. Testing POST /api/bookings (capacity validation - should fail)..."
curl -s -X POST "$BASE_URL/api/bookings" \
  -H "Content-Type: application/json" \
  -d "{
    \"venueId\": \"$VENUE_ID\",
    \"companyName\": \"Big Company\",
    \"email\": \"big@example.com\",
    \"startDate\": \"2024-12-26T00:00:00.000Z\",
    \"endDate\": \"2024-12-30T00:00:00.000Z\",
    \"attendeeCount\": 500
  }" | jq '{error, message}'
echo ""

# Test 8: Test double-booking prevention
echo "8. Testing POST /api/bookings (double-booking prevention - should fail)..."
curl -s -X POST "$BASE_URL/api/bookings" \
  -H "Content-Type: application/json" \
  -d "{
    \"venueId\": \"$VENUE_ID\",
    \"companyName\": \"Another Company\",
    \"email\": \"another@example.com\",
    \"startDate\": \"2024-12-22T00:00:00.000Z\",
    \"endDate\": \"2024-12-24T00:00:00.000Z\",
    \"attendeeCount\": 15
  }" | jq '{error, message}'
echo ""

# Test 9: Get all bookings
echo "9. Testing GET /api/bookings (all bookings)..."
curl -s "$BASE_URL/api/bookings" | jq '.data | length'
echo " bookings found"
echo ""

echo "======================================"
echo "All tests completed!"
echo "======================================"
