compile:
	npx hardhat compile

deploy:
	npx hardhat run ignition/modules/Nebula.ts --network baseSepolia

verify:
	@if [ "$(network)" = "sepolia" ]; then \
		npx hardhat verify --network sepolia 0x16955047994d6B59cfc21A397ed712b9eeE426Ad; \
	elif [ "$(network)" = "amoy" ]; then \
		npx hardhat verify --network amoy 0x518Cccfff4a08886B6ccb65B6aAE83af75Bc20c6; \
	elif [ "$(network)" = "basesepolia" ]; then \
		npx hardhat verify --network baseSepolia 0x64801c4e53b942Ff5d5eef0b77f4FA5024b03D56; \
	else \
		echo "Please specify a valid network (sepolia, amoy, or basesepolia)."; \
	fi
