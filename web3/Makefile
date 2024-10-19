compile:
	npx hardhat compile

deploy:
	npx hardhat run ignition/modules/Nebula.ts --network amoy

verify:
	@if [ "$(network)" = "sepolia" ]; then \
		npx hardhat verify --network sepolia 0x16955047994d6B59cfc21A397ed712b9eeE426Ad; \
	elif [ "$(network)" = "amoy" ]; then \
		npx hardhat verify --network amoy 0x9d0e07732Bc3db8DD91110aA970abC26B11D0DF8; \
	elif [ "$(network)" = "basesepolia" ]; then \
		npx hardhat verify --network baseSepolia 0xDE115676F736F154eEF8398A37e4ACB4d61892e6; \
	else \
		echo "Please specify a valid network (sepolia, amoy, or basesepolia)."; \
	fi
