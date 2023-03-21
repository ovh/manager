.PHONY: test
test:
	shellcheck scripts/release/release.sh scripts/regions/check-regions.sh
