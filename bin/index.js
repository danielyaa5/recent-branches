#!/usr/bin/env node

import { run } from '../index.js'
run().catch(e => e && console.error(e))
